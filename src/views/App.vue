<template>
	<div class="container-fluid contacts full-height text-white">
		<CallNotification v-if="isOperational()" />
		<div class="row full-height" v-if="isOperational()">
			<aside
				class="col-sm-5 col-md-4 col-lg-3 contacts d-flex flex-column"
			>
				<Sidebar />
			</aside>
			<div class="col-sm-7 col-md-8 col-lg-9 chat d-flex flex-column">
				<ContactHome v-if="currentView == 'contacts'" />
				<Settings v-if="currentView == 'settings'" />
				<Conversation
					v-if="
						currentView == 'conversation' ||
						currentView == 'archives'
					"
				/>
			</div>
		</div>
		<div
			class="row full-height d-flex align-items-center"
			v-if="!isOperational()"
		>
			<div class="d-flex flex-column mx-auto">
				<div v-show="!loaded">
					<h1>DIX-CORDES</h1>
					<p>Application en cours de chargement</p>
				</div>
				<div v-if="appError">
					<h1>ERREUR</h1>
					<h4>{{ appError.reason }}</h4>
					<p>{{ appError.details }}</p>
				</div>
			</div>
		</div>
	</div>
	<CallWidget v-if="isOperational()" />
</template>

<script>
import axios from 'axios'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import Conversation from '../components/Conversation.vue'
import Sidebar from '../components/Sidebar.vue'
import ContactHome from '../components/ContactHome.vue'
import Settings from '../components/Settings.vue'
import CallNotification from '../components/CallNotification.vue'
import CallWidget from '../components/CallWidget.vue'

export default {
	inheritAttrs: false,
	props: ['currentContact', 'currentViewProp', 'currentArchive'],
	components: {
		Conversation,
		Sidebar,
		ContactHome,
		Settings,
		CallNotification,
		CallWidget,
	},
	data: function () {
		return {
			loaded: false,
		}
	},
	computed: {
		...mapGetters({
			user: 'user/getInfo',
			selfToken: 'user/getToken',
			currentView: 'user/getView',
			appError: 'user/getErrors',

			ongoingConversation: 'conversations/getCurrentConversation',
			selectedContact: 'conversations/getCurrentContactId',

			contacts: 'contacts/getContacts',
		}),
	},
	watch: {
		selfToken(v) {
			if (!v) this.$router.push('/app/login')
		},
		ongoingConversation(v) {
			if (!this.isOperational()) return
			if (v) {
				this.setView('conversation')
				const contact = this.contacts.find((c) => c.id == v.contactId)

				document.title = contact.nickname

				if (v.type == 'conversation') {
					this.$router.push({
						name: 'ApplicationContactInput',
						params: { currentContact: contact.id },
					})
				} else {
					this.$router.push({
						name: 'ApplicationArchiveInput',
						params: { currentArchive: contact.id },
					})
				}
			}
		},
		currentView(v) {
			if (!this.isOperational()) return
			if (v !== 'conversation') {
				document.title = v.charAt(0).toUpperCase() + v.slice(1)
				this.$router.push({
					name: 'ApplicationViewInput',
					params: { currentViewProp: v },
				})
				this.setCurrentContactId(null)
			}
		},
	},
	methods: {
		...mapActions('user', [
			'retrieveUserInfo',
			'logout',
			'setView',
			'makeError',
		]),
		...mapActions('conversations', [
			'setCurrentContactId',
			'retrieveConversations',
			'retrieveMessages',
			'displayConversation',
		]),
		...mapActions('contacts', ['retrieveContacts']),
		...mapActions('peer', ['initPeer']),
		...mapMutations('peer', ['setVideoStream']),
		...mapMutations('contacts', ['setContactData']),

		isOperational() {
			if (this.loaded && !this.appError && this.selfToken) {
				return true
			}
			return false
		},
	},
	created: async function () {
		this.makeError()
		if (!this.selfToken) return this.$router.push('/app/login')
		axios.defaults.headers.common['Authorization'] =
			'Bearer ' + this.selfToken
		axios.interceptors.response.use(
			(res) => res,
			(err) => {
				const pl = {
					reason: 'API ERROR',
					details: JSON.stringify(err),
					reset: true,
				}
				this.makeError(pl)
			}
		)

		try {
			const req = await this.retrieveUserInfo('self')
			if (req?.data?.output === null) throw 'no user info'
			await this.retrieveContacts()
			await this.retrieveConversations()
			this.$socket =
				(await this.$socket.init(this.selfToken)) || this.$socket
			await this.initPeer(this.selfToken)
		} catch (e) {
			console.log(e)
			return this.logout()
		}

		if (this.currentContact) {
			this.setView('conversation')
			const req = await this.retrieveUserInfo(this.currentContact)
			if (req.error) {
				this.setView('contacts')
			} else {
				const contact = req.output
				await this.setContactData(contact)
				this.$router.push({
					name: 'ApplicationContactInput',
					params: { currentContact: contact.id },
				})
				const payload = {
					contactId: contact.id,
					type: 'conversation',
				}
				this.displayConversation(payload)
			}
		} else if (this.currentArchive) {
			this.setView('archives')
			const req = await this.retrieveUserInfo(this.currentArchive)
			if (req.error) {
				this.setView('contacts')
			} else {
				const payload = {
					contactId: req.output.id,
					type: 'archive',
				}
				this.displayConversation(payload)
			}
		} else {
			await this.setView(this.currentViewProp || 'contacts')
		}

		this.loaded = true
	},
	mounted: function () {
		let getUserMedia =
			navigator.mediaDevices.getUserMedia ||
			navigator.mediaDevices.webkitGetUserMedia ||
			navigator.mediaDevices.mozGetUserMedia

		if (getUserMedia) {
			getUserMedia({ video: true, audio: true })
				.then((mediaStream) => {
					this.setVideoStream(mediaStream)
				})
				.catch((error) => {
					console.error(
						'Error accessing webcam and microphone:',
						error
					)
				})
		} else {
			console.error('getUserMedia is not supported in this browser')
		}
	},
}
</script>

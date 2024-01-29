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
				<Conversation v-if="ongoingConversation && selectedContact" />
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
	replace: false,
	props: ['currentContact', 'currentViewProp'],
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

			ongoingConversation: 'conversations/getConversation',
			selectedContact: 'conversations/getContact',

			contacts: 'contacts/getContacts',
		}),
	},
	watch: {
		selfToken(v) {
			console.log('selfToken', v)
			if (!v) this.$router.push('/app/login')
		},
		ongoingConversation(v) {
			if (!this.isOperational()) return
			if (v) {
				this.setView('conversation')
				document.title = this.selectedContact.nickname

				if (v.type == 'conversation') {
					this.$router.push({
						name: 'ApplicationContactInput',
						params: { currentContact: this.selectedContact.id },
					})
				} else {
					this.$router.push({
						name: 'ApplicationArchiveInput',
						params: { currentArchive: v.convId },
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
				this.setContact(null)
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
			'setContact',
			'retrieveConversations',
			'retrieveMessages',
		]),
		...mapActions('contacts', ['retrieveContacts', 'updateContact']),
		...mapActions('peer', ['initPeer']),
		...mapMutations('peer', ['setVideoStream']),

		async selectContact(contact) {
			this.$router.push({
				name: 'ApplicationContactInput',
				params: { currentContact: contact.id },
			})
		},

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

		// Load data from API
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

		//Override store from router props
		if (this.currentContact) {
			const req = await this.retrieveUserInfo(this.currentContact)
			if (req.error) {
				this.setView('contacts')
			} else {
				const userinfo = req.output
				await this.updateContact(userinfo)
				await this.selectContact(userinfo)
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

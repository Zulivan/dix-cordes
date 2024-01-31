<template>
	<div class="row p-2" v-if="contact">
		<div class="col-10 d-flex">
			<img
				class="img-fluid rounded-circle"
				style="height: 70px"
				:src="
					require(
						'@/assets/images/' + (contact?.image || 'unknown.png')
					)
				"
			/>
			<div class="pl-2 d-flex flex-column">
				<h2 class="align-middle">
					Conversation avec
					{{ contact?.nickname || 'personne' }}
				</h2>
				<div class="d-flex">
					<div
						v-if="contact?.status_object"
						class="statusTab mr-1"
						:style="{
							'background-color': contact?.status_object.color,
						}"
					></div>
					<h6>
						{{ contact?.motd || contact?.status_object?.name }}
					</h6>
				</div>
			</div>
		</div>
		<div class="col-2 d-flex justify-content-end align-items-center">
			<i
				:class="{
					'fas fa-phone-alt p-2': !isContactInStreams(),
					'fas fa-phone-slash p-2': isContactInStreams(),
				}"
				style="cursor: pointer; font-size: 30px"
				:style="{ color: callIconColor }"
				@mouseover="callIconColor = '#00cc00'"
				@mouseleave="callIconColor = '#999999'"
				@click="() => initiateCall(contact)"
				v-show="conversation?.type == 'conversation'"
			></i>
			<i
				class="fas fa-archive p-2"
				style="cursor: pointer; font-size: 30px"
				:style="{ color: archiveIconColor }"
				@mouseover="archiveIconColor = '#00cc00'"
				@mouseleave="archiveIconColor = '#999999'"
				@click="archiveCurrentConversation"
				v-show="conversation?.type == 'conversation'"
			></i>
		</div>
	</div>
	<ConversationCall v-if="isContactInStreams()" />
	<div class="messagebox" ref="messageBox">
		<template v-for="message in renderMessage()" v-bind:key="message.id">
			<Message :message="message" :view="message.view" />
		</template>
	</div>
	<div v-show="conversation?.type == 'conversation'" class="text-center">
		<textarea
			maxlength="256"
			ref="keyboardRef"
			placeholder="Ecrivez un message"
			v-model="message"
		>
		</textarea>
	</div>
	<div ref="typing"></div>
</template>

<script>
import axios from 'axios'
import jquery from 'jquery'
import 'jquery-ui-bundle'
import 'jquery-ui-bundle/jquery-ui.css'

import 'virtual-keyboard/dist/js/jquery.keyboard.js'
import 'virtual-keyboard/dist/css/keyboard.min.css'

import Message from '../components/Message.vue'
import ConversationCall from '../components/ConversationCall.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
	// relating to the attribute define in outer <router-view> tag.
	components: { Message, ConversationCall },
	data: function () {
		return {
			message: '',
			callIconColor: '#999999',
			archiveIconColor: '#999999',
		}
	},
	computed: {
		...mapGetters({
			contactId: 'conversations/getCurrentContactId',
			messages: 'conversations/getMessages',
			conversation: 'conversations/getCurrentConversation',

			currentView: 'user/getView',
			token: 'user/getToken',

			streams: 'peer/getRemoteStreamsMetadata',
		}),

		contact: function () {
			return this.contactId
				? this.$store.getters['contacts/getContact'](this.contactId)
				: null
		},
	},
	watch: {
		message() {
			this.message = this.message.slice(0, 255)
		},
		messages: {
			deep: true,

			handler() {
				setTimeout(() => {
					if (this.$refs.messageBox)
						this.$refs.messageBox.scrollTop =
							this.$refs.messageBox.scrollHeight
				}, 0)
			},
		},
	},
	methods: {
		...mapActions('conversations', [
			'sendMessage',
			'archiveCurrentConversation',
		]),
		...mapActions('peer', ['sendCallRequest']),

		isContactInStreams() {
			if (!this.contact) return false
			for (const stream of this.streams) {
				if (stream?.id == this?.contact?.id) return true
			}
			return false
		},

		async initiateCall(contact) {
			const res = await axios.get('contacts/getPeer/ ' + contact?.id)
			if (res.data.output)
				this.sendCallRequest({ ...res.data.output, token: this.token })
			else console.log('error: no peer found')
		},

		renderMessage() {
			let prevMessage = null

			for (const message of this.messages) {
				if (prevMessage?.sender == message.sender) {
					message.view = 'light'
				} else {
					message.view = 'full'
				}
				prevMessage = message
			}
			return this.messages
		},
	},
	mounted: function () {
		let options = {
			layout: 'french-azerty-1',
			usePreview: false,
			language: 'fr',
			maxLength: 255,
			css: {
				input: 'text-white form-control input-sm chat',
				container: 'center-block well bg-dark',
				buttonDefault: 'btn bg-muted',
				buttonHover: 'btn-primary',
				buttonAction: 'active',
				buttonDisabled: 'disabled',
			},
		}
		;(jquery.keyboard.layouts['french-azerty-1'] = {
			name: 'french-azerty-1',
			lang: ['fr'],
			normal: [
				'² & é " \' ( - è _ ç à ) = {bksp}',
				'{tab} a z e r t y u i o p ^ $',
				'q s d f g h j k l m  ù * {enter}',
				'{shift} < w x c v b n , ; : ! {shift}',
				'{cancel} {alt} {space} {alt} {accept}',
			],
			shift: [
				'{sp:1} 1 2 3 4 5 6 7 8 9 0 ° + {bksp}',
				'{tab} A Z E R T Y U I O P ¨ £',
				'Q S D F G H J K L M % µ {enter}',
				'{shift} > W X C V B N ? . / § {shift}',
				'{cancel} {alt} {space} {alt} {accept}',
			],
			alt: [
				'² & ~ # { [ | ` \\ ^ @ ] } {bksp}',
				'{tab} a z € r t y u i o p ^ ¤',
				'q s d f g h j k l m  ù * {enter}',
				'{shift} < w x c v b n , ; : ! {shift}',
				'{cancel} {alt} {space} {alt} {accept}',
			],
			'alt-shift': [
				'{sp:1} 1 ~ # { [ | ` \\ ^ @ ] } {bksp}',
				'{tab} A Z € R T Y U I O P ¨ ¤',
				'Q S D F G H J K L M % µ {enter}',
				'{shift} > W X C V B N ? . / § {shift}',
				'{cancel} {alt} {space} {alt} {accept}',
			],
		}),
			(jquery.keyboard.language.fr = {
				language: 'Français (French)',
				display: {
					a: '✔:Envoyer',
					accept: 'Envoyer',
					alt: 'AltGr:Caractère alternatif',
					b: '←:Suppr arrière',
					bksp: '←Suppr:Suppr arrière',
					c: '✖:Annuler',
					cancel: 'Annuler:Annuler (Échap)',
					clear: 'C:Effacer',
					combo: 'ö:Bacsuler les touches combo',
					dec: '.:Decimal',
					e: '↵:Entrée',
					enter: 'Entrée:Entrée',
					lock: '⇪ Verr Mag:Verouillage majuscule',
					s: '⇧:Majuscule',
					shift: 'Maj:Majuscule',
					sign: '±:Change de signe',
					space: '&nbsp;:Espace',
					t: '⇥:Tabulation',
					tab: '⇥ Tab:Tabulation',
				},
				wheelMessage:
					'Utiliser la molette de la souris pour voir les autres lettres',
			})

		const keyboardSelector = jquery(this.$refs.keyboardRef)
		keyboardSelector.keyboard(options)

		const self = this

		keyboardSelector.bind('accepted', function () {
			self.sendMessage(self.message)
			self.message = ''
		})
		keyboardSelector.bind('keyboardChange', function () {
			self.message = self.$refs.keyboardRef.value
		})
	},
}
</script>

<template>
	<div ref="container-above" class="row">
		<div
			ref="container"
			class="w-100"
			:style="{ height: height, overflow: 'auto' }"
		>
			<div class="px-5" v-if="orderedContacts().length == 0">
				{{
					showArchives
						? $t('conversationList.noArchives')
						: $t('conversationList.noConversations')
				}}
			</div>
			<div
				v-for="contact in orderedContacts()"
				v-bind:key="contact.naturalId"
			>
				<Contact
					:contact="contact"
					:selected="isSelected(contact)"
					:trigger="convTrigger()"
					v-show="filterCheck(contact)"
					@selectContact="select(contact)"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { useSound } from '@vueuse/sound'

import Contact from './Contact.vue'
import clickSound from '../assets/audio/app/pop.mp3'

export default {
	props: ['contacts', 'filter', 'showArchives', 'height'],
	components: { Contact },
	setup() {
		const { play } = useSound(clickSound)

		return {
			play,
		}
	},
	data() {
		return {
			debounce: null,
		}
	},
	computed: {
		...mapGetters({
			selectedContactId: 'conversations/getCurrentContactId',
			conversations: 'conversations/getConversations',
			conversation: 'conversations/getCurrentConversation',
			archives: 'conversations/getArchivedConversations',
			getContact: 'contacts/getContact',

			currentView: 'user/getView',
		}),
	},
	methods: {
		...mapActions('conversations', ['displayConversation', 'forget']),
		...mapActions('contacts', ['updateContact']),

		orderedContacts() {
			const convfeed = this.showArchives
				? this.archives
				: this.conversations
			let naturalId = 0

			return Object.values(convfeed)
				.map(([contactId]) => {
					let contact = this.getContact(contactId)
					if (!contact) this.updateContact(contactId)
					return contact && { ...contact, naturalId: naturalId++ }
				})
				.filter(Boolean)
		},

		convTrigger() {
			if (this.showArchives) return
			return {
				func: (contact) => {
					this.forget(contact.id)
				},
				icon: 'X',
			}
		},

		select(contact) {
			if (this.isSelected(contact)) return

			if (this.debounce && Date.now() - this.debounce < 1) return
			this.debounce = Date.now()

			this.play()

			const payload = {
				contactId: contact.id,
			}
			if (this.showArchives) {
				payload.type = 'archive'
			}
			this.displayConversation(payload)
		},

		isSelected(contact) {
			return this.selectedContactId == contact.id
		},

		filterCheck(contact) {
			if (!this.filter) return true

			return (
				contact.nickname
					.toLowerCase()
					.indexOf(this.filter.toLowerCase()) > -1
			)
		},
	},
}
</script>

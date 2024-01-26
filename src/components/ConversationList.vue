<template>
	<div style="flex-grow: 1; flex-basis: 0; overflow: auto" class="row">
		<div class="w-100">
			<div class="py-5 p-2" v-if="orderedContacts().length == 0">
				Pas de conversations en cours
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
	// relating to the attribute define in outer <router-view> tag.
	props: ['contacts', 'filter', 'showArchives'],
	components: { Contact },
	setup() {
		const { play } = useSound(clickSound)

		return {
			play,
		}
	},
	computed: {
		...mapGetters({
			selectedContact: 'conversations/getContact',
			conversations: 'conversations/getConversations',
			conversation: 'conversations/getConversation',
			archives: 'conversations/getArchivedConversations',
			getContact: 'contacts/getContact',

			currentView: 'user/getView',
		}),
	},
	methods: {
		...mapActions('conversations', ['displayConversation', 'forget']),
		...mapActions('contacts', ['updateContact']),

		async orderedContacts() {
			let res = []
			let convfeed = this.conversations
			let naturalId = 0

			if (this.showArchives) convfeed = this.archives

			for (const key in convfeed) {
				let contact
				let element = convfeed[key]
				if (this.showArchives) {
					//Deep copy
					contact = JSON.parse(
						JSON.stringify(this.getContact(element.contact.id))
					)

					contact.convId = key
					contact.status_object = null
					contact.ignoreUnreads = true
					contact.motd =
						'Archive ' +
						new Date(element.date).toLocaleTimeString('en-GB', {
							month: '2-digit',
							day: '2-digit',
							hour: '2-digit',
							minute: '2-digit',
						})
				} else {
					contact = this.getContact(element[0])
					if (!contact) {
						await this.updateContact(element[0])
						contact = this.getContact(element[0])
					}
				}
				contact.naturalId = naturalId++
				res.push(contact)
			}

			return res
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

			this.play()

			let payload = {
				contact,
				convId: contact.convId || contact.id,
				type: 'conversation',
			}

			if (this.showArchives) {
				payload.type = 'archive'
			}
			this.displayConversation(payload)
		},

		isSelected(contact) {
			if (this.showArchives) {
				return this.conversation.convId == contact.convId
			} else {
				return (
					this.selectedContact &&
					this.selectedContact.id == contact.id
				)
			}
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

<template>
	<div style="flex-grow: 1; flex-basis: 0; overflow: auto" class="row">
		<div class="w-100">
			<template v-for="contact in contacts" v-bind:key="contact.id">
				<Contact
					:contact="contact"
					:fullMotd="this.fullMotd"
					v-show="filterCheck(contact)"
					@selectContact="this.select(contact)"
				/>
			</template>
		</div>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { useSound } from '@vueuse/sound'

import Contact from '../components/Contact.vue'
import clickSound from '../assets/audio/app/pop.mp3'

export default {
	// relating to the attribute define in outer <router-view> tag.
	props: ['contacts', 'filter', 'fullMotd'],
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
			convUnreads: 'conversations/getUnreads',
			user: 'user/getInfo',
		}),
	},
	methods: {
		...mapActions('conversations', ['displayConversation']),
		...mapActions('contacts', ['retrieveContacts']),

		select(contact) {
			if (contact.id == this.user.id) return
			this.play()
			const payload = {
				contact,
				convId: contact.id,
				type: 'conversation',
			}
			this.displayConversation(payload)
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
	mounted() {
		this.retrieveContacts()
	},
}
</script>

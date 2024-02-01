<template>
	<div class="row d-block overflow-auto" :style="{ height: height }">
		<template v-for="contact in contacts" v-bind:key="contact.id">
			<Contact
				:contact="contact"
				v-show="filterCheck(contact)"
				@selectContact="this.select(contact)"
			/>
		</template>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { useSound } from '@vueuse/sound'

import Contact from '../components/Contact.vue'
import clickSound from '../assets/audio/app/pop.mp3'

export default {
	// relating to the attribute define in outer <router-view> tag.
	props: ['contacts', 'filter', 'height'],
	components: { Contact },
	setup() {
		const { play } = useSound(clickSound)

		return {
			play,
		}
	},
	mounted() {
		this.retrieveContacts()
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
				contactId: contact.id,
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
}
</script>

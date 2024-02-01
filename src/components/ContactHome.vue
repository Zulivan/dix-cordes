<template>
	<div class="row">
		<div class="col-12" ref="container">
			<h2 class="d-flex justify-content-center">
				{{ $t('contactList.title') }}
			</h2>
			<h4 class="d-flex justify-content-center">
				{{ $t('contactList.subtitle') }}
			</h4>
		</div>

		<div class="col-12">
			<ContactList :contacts="contacts" :height="contactListHeight" />
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import ContactList from './ContactList.vue'

export default {
	components: { ContactList },
	data() {
		return {
			contactListHeight: '0px',
		}
	},
	mounted() {
		this.setContainerHeight()
		window.addEventListener('resize', this.setContainerHeight)
	},
	methods: {
		setContainerHeight() {
			const viewportHeight = window.innerHeight
			const container = this.$refs.container
			if (!container) return

			const height = viewportHeight - container.clientHeight
			this.contactListHeight = height + 'px'
		},
	},

	computed: {
		...mapGetters({
			contacts: 'contacts/getContacts',
		}),
	},
}
</script>

<template>
	<div class="row">
		<div class="col-12">
			<h2 class="d-flex justify-content-center">Vos contacts</h2>
			<h4 class="d-flex justify-content-center">
				Cliquez pour commencer une conversation
			</h4>
		</div>

		<div class="col-12">
			<ContactList :contacts="contacts" />
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import ContactList from './ContactList.vue'

export default {
	replace: false,
	components: { ContactList },
	computed: {
		...mapGetters({
			contacts: 'contacts/getContacts',
		}),
	},
}
</script>

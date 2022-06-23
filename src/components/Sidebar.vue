<template>
	<div class="shadow w-100">
		<div class="row py-2 w-100">
			<div class="col-6 d-flex justify-content-center">
				<button
					@click="this.setView('contacts')"
					class="btn btn-primary"
				>
					Contacts
				</button>
			</div>
			<div class="col-6 d-flex justify-content-center">
				<button
					@click="this.setView('archives')"
					class="btn btn-primary"
				>
					Conv. Archivées
				</button>
			</div>

			<div class="col-12 d-flex justify-content-center">
				<input
					class="my-2 w-75"
					type="text"
					placeholder="Filtrer par nom"
					v-model="sidebarFilter"
				/>
			</div>
		</div>
	</div>

	<ConversationList
		:contacts="contacts"
		:filter="sidebarFilter"
		:showArchives="this.currentSidebarView == 'archives'"
	/>

	<div class="row p-2 chat p-1">
		<div class="col-12 px-0">
			<img
				:src="
					require('@/assets/images/' + (user.image || 'unknown.png'))
				"
				class="img-fluid rounded-circle message-img mr-2"
			/>
			<h5>{{ user.nickname }}</h5>
			<div class="d-flex">
				<div
					class="statusTab mr-1"
					:style="{ 'background-color': user.status_object.color }"
				></div>
				<h6>
					{{
						(user.motd && user.motd.length > 26
							? user.motd.slice(0, 26) + '...'
							: user.motd) || user.status_object.name
					}}
				</h6>
			</div>
		</div>
		<div class="d-flex col-12 justify-content-around px-0 pt-2">
			<button @click="logout" class="btn btn-primary">Déconnecter</button>
			<button @click="setView('settings')" class="btn btn-primary">
				Paramètres
			</button>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ConversationList from './ConversationList.vue'

export default {
	replace: false,
	components: { ConversationList },
	data() {
		return {
			sidebarFilter: null,
			conversationMessages: {},
		}
	},
	computed: {
		...mapGetters({
			user: 'user/getInfo',
			currentView: 'user/getView',
			currentSidebarView: 'user/getSidebarView',

			contacts: 'contacts/getContacts',
		}),
	},
	methods: {
		...mapActions('user', ['logout', 'setView']),

		name() {
			const str = this.currentView

			return str.charAt(0).toUpperCase() + str.slice(1)
		},
	},
}
</script>

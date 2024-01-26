<template>
	<div class="shadow w-100">
		<div class="row py-2 w-100">
			<div class="col-6 d-flex justify-content-center">
				<div
					@click="this.setView('contacts')"
					:class="{ 'active-tab': currentView === 'contacts' }"
					class="tab"
				>
					Contacts
				</div>
			</div>
			<div class="col-6 d-flex justify-content-center">
				<div
					@click="this.setView('archives')"
					:class="{ 'active-tab': currentView === 'archives' }"
					class="tab"
				>
					Conv. Archivées
				</div>
			</div>

			<div class="col-12 d-flex justify-content-center">
				<div class="search-bar">
					<input
						class="my-2 w-100"
						type="text"
						placeholder="Filtrer par nom"
						v-model="sidebarFilter"
					/>
				</div>
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
			<div class="d-flex">
				<h5
					style="
						display: inline;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					"
				>
					{{ user.nickname }}
				</h5>
			</div>
			<div class="d-flex">
				<div class="mr-1">
					<div
						class="statusTab"
						:style="{
							'background-color': user.status_object.color,
						}"
					></div>
				</div>
				<span
					style="
						display: inline;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					"
				>
					{{ user.motd || user.status_object.name }}
				</span>
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

<style>
.tab {
	cursor: pointer;
	padding: 10px;
	border: 1px solid #ccc;
	border-radius: 5px;
	margin: 5px;
}

.active-tab {
	background-color: #007bff;
	color: #fff;
}

.search-bar {
	display: flex;
	align-items: center;
}
</style>

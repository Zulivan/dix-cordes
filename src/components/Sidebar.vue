<template>
	<div class="shadow w-100">
		<div class="row p-0" ref="searchAndTabs">
			<div class="col-12 d-flex justify-content-center my-1">
				<input
					class="w-100 form-control bg-dark border-primary text-white"
					type="text"
					placeholder="Rechercher..."
					v-model="sidebarFilter"
				/>
			</div>
			<div class="col-12">
				<ul class="nav nav-tabs" role="tablist">
					<li v-for="tab in tabs" :key="tab.id" class="nav-item">
						<a
							@click="setView(tab.view)"
							:class="{ active: currentSidebarView === tab.view }"
							class="nav-link"
							data-toggle="tab"
							role="tab"
							:aria-controls="tab.view"
							:aria-selected="currentSidebarView === tab.view"
						>
							{{ tab.label }}
						</a>
					</li>
				</ul>
			</div>
		</div>

		<div class="tab-content" ref="tabContent">
			<div
				v-for="tab in tabs"
				:key="tab.id"
				class="tab-pane fade p-0"
				:class="{ 'show active': currentSidebarView === tab.view }"
				:role="'tabpanel'"
				:aria-labelledby="`${tab.view}-tab`"
			>
				<!-- Content for each tab -->
				<ConversationList
					:contacts="contacts"
					:filter="sidebarFilter"
					:showArchives="currentSidebarView === 'archives'"
					:height="conversationListHeight"
				/>
			</div>
		</div>

		<!-- User details at the bottom of the sidebar -->
		<div class="row p-2 chat p-1" ref="userDetails">
			<div class="col-12 px-0">
				<img
					:src="
						require(
							`@/assets/images/${user?.image || 'unknown.png'}`
						)
					"
					class="img-fluid rounded-circle message-img mr-2"
				/>
				<div class="d-flex flex-column">
					<h5 class="mb-1">{{ user?.nickname }}</h5>
					<div class="d-flex align-items-center mb-1">
						<div class="mr-1">
							<div
								class="statusTab"
								:style="{
									'background-color':
										user?.status_object?.color,
								}"
							></div>
						</div>
						<span>{{
							user?.motd || user?.status_object?.name
						}}</span>
					</div>
				</div>
			</div>

			<div class="d-flex col-12 justify-content-start px-0 pt-2">
				<button @click="logout" class="btn btn-danger mx-1">
					Se déconnecter
				</button>
				<button @click="setView('settings')" class="btn btn-warning">
					Paramètres
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ConversationList from './ConversationList.vue'
export default {
	components: { ConversationList },
	data() {
		return {
			sidebarFilter: null,
			conversationListHeight: '0px',
		}
	},
	mounted() {
		this.setConversationListHeight()
		window.addEventListener('resize', this.setConversationListHeight)
	},
	methods: {
		...mapActions('user', ['logout', 'setView']),
		setConversationListHeight() {
			const viewportHeight = window.innerHeight
			const searchAndTabs = this.$refs.searchAndTabs
			const userDetails = this.$refs.userDetails
			if (!searchAndTabs || !userDetails) return

			const height =
				viewportHeight -
				searchAndTabs.clientHeight -
				userDetails.clientHeight

			this.conversationListHeight = height + 'px'
		},
	},
	computed: {
		...mapGetters({
			user: 'user/getInfo',
			currentSidebarView: 'user/getSidebarView',
			contacts: 'contacts/getContacts',
		}),
		tabs() {
			return [
				{ id: 1, view: 'contacts', label: 'Contacts' },
				{ id: 2, view: 'archives', label: 'Conv. Archivées' },
			]
		},
	},
}
</script>

<style scoped>
.nav-link {
	border-radius: 0;
	margin: 0;
	cursor: pointer;
}

.nav-link.active {
	background-color: #007bff;
	color: #fff;
}

.nav-tabs {
	border-bottom: 1px solid #dee2e6;
}

.tab-content {
	flex: 1 1 auto;
}

.tab-pane {
	padding: 15px;
}
</style>

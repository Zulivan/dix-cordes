import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import user from './user'
import conversations from './conversations'
import contacts from './contacts'
import peer from './peer'

export default createStore({
	modules: {
		user,
		conversations,
		contacts,
		peer,
	},
	plugins: [
		createPersistedState({
			paths: ['user', 'conversations'],
		}),
	],
	mutations: {
		reset(state) {
			state.user = user.state()
			state.conversations = conversations.state()
			state.contacts = contacts.state()
		},
	},
	actions: {
		reset({ commit }) {
			commit('reset')
		},
	},
})

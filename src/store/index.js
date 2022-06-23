import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import user from './user'
import conversations from './conversations'
import contacts from './contacts'

export default createStore({
	modules: {
		user,
		conversations,
		contacts,
	},
	plugins: [
		createPersistedState({
			paths: ['user', 'conversations'],
		}),
	],
})

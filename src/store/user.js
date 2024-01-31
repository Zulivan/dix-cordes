import axios from 'axios'
import store from '../store/index.js'

export default {
	namespaced: true,
	state: () => ({
		appError: null,
		userToken: null,
		userInfo: {},
		currentView: 'contacts',
		sidebarView: 'contacts',
	}),
	getters: {
		getInfo: (state) => state.userInfo,
		getToken: (state) => state.userToken,
		getView: (state) => state.currentView,
		getSidebarView: (state) => state.sidebarView,
		getErrors: (state) => state.appError,
	},
	mutations: {
		deleteUserToken(state) {
			state.userToken = null
		},
		setUserToken(state, userToken) {
			state.userToken = userToken
		},
		setUser(state, user) {
			state.userInfo = user
		},
		setError(state, pl) {
			state.appError = pl
		},
		setUserCurrentView(state, viewVal) {
			state.currentView = viewVal
			if (viewVal == 'archives' || viewVal == 'contacts') {
				state.sidebarView = viewVal
			}
		},
	},
	actions: {
		async setView(state, viewVal) {
			state.commit('setUserCurrentView', viewVal)
			if (viewVal == 'archives' || viewVal == 'contacts') {
				store.dispatch('conversations/unselectConversation', null, {
					root: true,
				})
			}
		},
		async updateInfo(state, data) {
			const res = await axios.put('/user/update', data)

			if (!res.data.error) {
				state.commit('setUser', res.data.output)
			}
			return res.data
		},
		async receiveUserUpdate(state, data) {
			state.commit('setUser', data)
		},
		async login(state, data) {
			const res = await axios.post('/auth/login', data)

			store.dispatch('reset')

			if (!res.data.error) state.commit('setUserToken', res.data.output)
			return res.data
		},
		async register(state, data) {
			const res = await axios.post('/auth/register', data)

			store.dispatch('reset')

			if (!res.data.error) state.commit('setUserToken', res.data.output)
			return res.data
		},
		async retrieveUserInfo(state, userid) {
			let id = userid || 'self'
			const url = '/user/getInfo/' + id
			try {
				const res = await axios.get(url)
				if (id == 'self') {
					state.commit('setUser', res?.data?.output)
				} else {
					return res.data
				}
			} catch (e) {
				console.log(e)
			}
		},
		async logout(state) {
			state.commit('deleteUserToken')
			store.dispatch('reset')
		},
		async makeError(state, pl) {
			if (!pl) return state.commit('setError', null)
			if (pl.reset) {
				setTimeout(() => {
					state.commit('setUserToken', null)
					location.reload()
				}, 5000)
			}
			state.commit('setError', pl)
		},
	},
}

import axios from 'axios'

export default {
	namespaced: true,
	state: () => ({
		list: [],
	}),
	mutations: {
		setContactList(state, contactList) {
			state.list = contactList
		},
		setContact(state, contact) {
			const id = contact.id
			const item = state.list.findIndex((element) => element.id == id)
			if (item == -1) {
				state.list.push(contact)
				return
			}

			state.list[item] = contact
		},
	},
	getters: {
		getContacts: (state) => {
			return state.list
		},
		getContact: (state) => (id) => {
			if (state.list.find((element) => element.id == id)) {
				return state.list.find((element) => element.id == id)
			} else {
				// TODO CONTACT NOT FOUND
			}
			return state.list.find((element) => element.id == id)
		},
	},
	actions: {
		async retrieveContacts(state) {
			const res = await axios.get('/contacts/getAll')

			state.commit('setContactList', res.data.output)
		},
		async updateContact(state, id) {
			const res = await axios.get('/user/getInfo/' + id)

			state.commit('setContact', res.data.output)
		},
		async receiveContactUpdate(state, user) {
			state.commit('setContact', user)
		},
	},
}

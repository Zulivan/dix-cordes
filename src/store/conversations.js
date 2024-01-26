import axios from 'axios'

export default {
	namespaced: true,
	state: () => ({
		currentContact: null,
		currentConversation: null,
		conversations: {},
		archivedConversations: [],
	}),
	getters: {
		getContact(state) {
			return state.currentContact
		},
		getConversation(state) {
			return state.currentConversation
		},
		getMessages(state) {
			return state.currentConversation?.messages || []
		},
		getUnreads: (state) => (id) => {
			if (
				!state.conversations[id] ||
				!Array.isArray(state.conversations[id])
			) {
				return 0
			}
			const conv = state.conversations[id] || []

			return conv.filter(
				(message) => !message.isread && message.sender_user.id == id
			).length
		},
		getConversations(state) {
			let sortable = []

			for (const [userId, messages] of Object.entries(
				state.conversations
			)) {
				if (
					messages &&
					Array.isArray(messages) &&
					messages.length > 0
				) {
					sortable.push([userId, messages[messages.length - 1].date])
				}
			}

			sortable.sort(function (a, b) {
				return new Date(b[1]) - new Date(a[1])
			})

			return sortable
		},
		getArchivedConversations(state) {
			return state.archivedConversations
		},
	},
	mutations: {
		async setContactMutator(state, contact) {
			state.currentContact = contact
		},
		async archiveConversation(state, data) {
			state.archivedConversations.push({
				...data,
				date: Date.now(),
			})
		},
		async setCurrentConversation(state, payload) {
			let convList, convo
			if (payload.type == 'conversation') {
				convList = state.conversations

				if (!convList[payload.convId]) convList[payload.convId] = []

				convo = convList[payload.convId]
			} else {
				convList = state.archivedConversations

				convo = convList[payload.convId].messages
			}

			state.currentConversation = { ...payload, messages: convo }
		},
		async setCurrentConversationMessages(state, messages) {
			const contact = state.currentContact

			state.conversations[contact.id] = messages
			state.currentConversation.messages = messages
		},
		async deleteMessage(state, message) {
			const conv = state.conversations[message.conversation]
			conv.splice(
				conv.findIndex((element) => element.id == message.id),
				1
			)

			if (
				message.conversation == state.currentConversation.contact.id &&
				state.currentConversation.type == 'conversation'
			) {
				state.currentConversation.messages = conv
			}
		},
		async forgetMutator(state, pl) {
			delete state.conversations[pl || state.currentContact.id]
		},
		async receiveMessage(state, message) {
			let contactId = message.sender_user.id
			if (message.initiator) contactId = message.recipient_user.id

			if (
				!state.conversations[contactId] ||
				!Array.isArray(state.conversations[contactId])
			)
				state.conversations[contactId] = []

			state.conversations[contactId].push(message)

			if (
				state.currentConversation &&
				state.currentConversation.contact.id == contactId
			) {
				state.currentConversation.messages =
					state.conversations[contactId]
			}
		},
	},
	actions: {
		async setContact(state, contact) {
			state.commit('setContactMutator', contact)
		},
		async displayConversation(state, payload) {
			state.commit('setContactMutator', payload.contact)
			if (payload.type == 'conversation')
				state.dispatch('retrieveMessages')
			state.commit('setCurrentConversation', payload)
		},
		async readAll(state) {
			const contact = state.getters.getContact

			if (!contact) return true

			const res = await axios.post('/conversations/readAll', {
				sender: contact.id,
			})
			return res.data
		},
		async archiveCurrentConversation(state) {
			const contact = state.getters.getContact
			const messages = state.getters.getMessages

			state.commit('archiveConversation', { contact, messages })
		},
		async retrieveMessages(state) {
			const contact = state.getters.getContact

			if (!contact) return true

			const res = await axios.post('/conversations/messages', {
				sender: contact.id,
			})

			state.commit('setCurrentConversationMessages', res.data.output)

			return res.data
		},
		async retrieveConversations() {
			const res = await axios.get('/conversations/list')

			//state.commit('setConversations', res.data.output)

			return res.data
		},
		async deleteMessage(state, id) {
			const res = await axios.delete('/conversations/messages', {
				data: {
					id,
				},
			})

			if (res.data.error) return
			state.commit('deleteMessage', res.data.output)

			return res.data
		},
		async receiveDeletion(state, pl) {
			state.commit('deleteMessage', pl)
		},
		async receiveMessage(state, pl) {
			state.commit('receiveMessage', pl)
		},
		async sendMessage(state, message) {
			const contact = state.getters.getContact

			const res = await axios.post('/conversations/message', {
				message,
				recipient: contact.id,
			})

			state.commit('receiveMessage', {
				...res.data.output,
				initiator: true,
			})

			return res.data
		},
		async forget(state, pl) {
			state.commit('forgetMutator', pl)
		},
	},
}

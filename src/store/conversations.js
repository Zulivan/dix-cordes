import axios from 'axios'

// currentConversation:
// type: conversation | group | channel
// id: identifier
// messages: messages array
export default {
	namespaced: true,
	state: () => ({
		currentContactId: null,
		conversations: {},
		archivedConversations: [],
	}),
	getters: {
		getCurrentContactId(state) {
			return state.currentContactId
		},
		getConversation: (state) => (id) => {
			return state.conversations[id]
		},
		getCurrentConversation(state) {
			return state.conversations[state.currentContactId]
		},
		getMessages(state) {
			return state.conversations[state.currentContactId]?.messages || []
		},
		getUnreads: (state) => (id) => {
			if (!state.conversations[id]) {
				return 0
			}
			const conv = state.conversations[id]?.messages || []

			return conv.filter(
				(message) => !message.isread && message.sender_user.id == id
			).length
		},
		getConversations(state) {
			return Object.keys(state.conversations)
				.filter((key) => {
					const conv = state.conversations[key]
					return conv.type === 'conversation'
				})
				.map((key) => [
					key,
					state.conversations[key]?.messages[
						state.conversations[key]?.messages.length - 1
					]?.date || 0,
				])
				.sort((a, b) => new Date(b[1]) - new Date(a[1]))
		},
		getArchivedConversations(state) {
			// return all conversations that have archived as type
			return Object.keys(state.conversations)
				.filter((key) => {
					const conv = state.conversations[key]
					return (
						conv.type === 'archived' &&
						conv.messages &&
						Array.isArray(conv.messages) &&
						conv.messages.length > 0
					)
				})
				.map((key) => [
					key,
					state.conversations[key].messages[
						state.conversations[key].messages.length - 1
					].date,
				])
				.sort((a, b) => new Date(b[1]) - new Date(a[1]))
		},
	},
	mutations: {
		async setCurrentContactId(state, id) {
			state.currentContactId = id
		},
		async archiveConversation(state, contactId) {
			state.conversations[contactId] = {
				...state.conversations[contactId],
				type: 'archived',
			}
		},
		async setCurrentConversation(state, payload) {
			if (!state.conversations[payload.contactId])
				state.conversations[payload.contactId] = {
					messages: [],
					contactId: payload.contactId,
					type: payload.type,
				}

			state.currentContactId = payload.contactId
		},
		async setCurrentConversationMessages(state, messages) {
			const contactId = state.currentContactId

			state.conversations[contactId].messages = messages
		},
		async deleteMessage(state, message) {
			const conv = state.conversations[message.conversation].messages
			conv.splice(
				conv.findIndex((element) => element.id == message.id),
				1
			)
		},
		async forgetConversation(state, id) {
			delete state.conversations[id || state.currentContactId]
		},
		async receiveMessage(state, message) {
			let contactId = message.sender_user.id
			if (message.initiator) contactId = message.recipient_user.id

			if (!state.conversations[contactId])
				state.conversations[contactId] = {
					messages: [],
					contactId,
					type: 'conversation',
				}
			state.conversations[contactId].type = 'conversation'
			state.conversations[contactId].messages.push(message)
		},
	},
	actions: {
		async displayConversation(state, payload) {
			state.commit('setCurrentContactId', payload.contactId)

			if (!payload.type) payload.type = 'conversation'

			state.commit('setCurrentConversation', payload)
			if (payload.type == 'conversation')
				state.dispatch('retrieveMessages')
		},
		async readAll(state) {
			const contactId = state.state.currentContactId
			if (!contactId) return true

			const res = await axios.post('/conversations/readAll', {
				sender: contactId,
			})
			return res.data
		},
		async archiveCurrentConversation(state) {
			const contactId = state.state.currentContactId

			state.commit('archiveConversation', contactId)
		},
		async retrieveMessages(state) {
			const contactId = state.state.currentContactId

			if (!contactId) return true

			const res = await axios.post('/conversations/messages', {
				sender: contactId,
			})

			state.commit('setCurrentConversationMessages', res.data.output)

			return res.data
		},
		async unselectConversation(state) {
			state.commit('setCurrentContactId', null)
		},
		async retrieveConversations() {
			const res = await axios.get('/conversations/list')

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
			const contactId = state.state.currentContactId
			if (!contactId) return true
			const res = await axios.post('/conversations/message', {
				message,
				recipient: contactId,
			})

			if (res.data.error) return

			state.commit('receiveMessage', {
				...res.data.output,
				initiator: true,
			})

			return res.data
		},
		async forget(state, pl) {
			state.commit('forgetConversation', pl)
		},
	},
}

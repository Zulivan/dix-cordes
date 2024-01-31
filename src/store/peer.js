import Peer from 'peerjs'

// Initial state
const initialState = {
	id: '',
	remoteId: '',
	peer: null,
	myLocalVideoStream: null,
	callStatus: '',
	remoteStreams: [],
	receiveCalls: [],
	usersMetadata: {},
	receiveConnections: [],

	myCalls: [],
}

const getters = {
	getPeerId: (state) => state.id,
	getUserMetadata: (state) => (id) => state.usersMetadata[id],
	getRemoteId: (state) => state.remoteId,
	getRemoteStreams: (state) => state.remoteStreams,
	getRemoteStreamsMetadata: (state) =>
		state.remoteStreams.map((item) => state.usersMetadata[item.peer]),
	getReceiveCalls: (state) => state.receiveCalls,
	getReceiveConnections: (state) => state.receiveConnections,
	getMyCalls: (state) => state.myCalls,
	getMyLocalVideoStream: (state) => state.myLocalVideoStream,
	getPeer: (state) => state.peer,
	getCallStatus: (state) => state.callStatus,
	isInCall: (state) => state.remoteStreams.length > 0,
}

const actions = {
	async sendCallRequest({ commit, dispatch, state }, payload) {
		commit('setCallStatus', 'Connecting to peer connection broker...')
		await dispatch('initPeer', payload.token)

		if (!state.remoteStreams.some((item) => item.peer === 'self')) {
			state.remoteStreams.push({
				peer: 'self',
				mute: true,
				stream: state.myLocalVideoStream,
			})
		}

		state.myCalls.push(payload.id)
		setTimeout(() => {
			state.peer.connect(payload.id)
			commit('setCallStatus', 'Calling contact...')
			state.peer.call(payload.id, state.myLocalVideoStream)
		}, 1000)
	},

	async initPeer({ commit, state }, token) {
		if (state.peer) {
			state.peer.destroy()
			state.peer = null
		}

		const payload = {
			host: process.env.VUE_APP_PEER_SERVER_HOST,
			port: process.env.VUE_APP_PEER_SERVER_PORT,
			secure: process.env.VUE_APP_ENV === 'production',
			path: '/rtc',
			config: {
				iceServers: [{ url: 'stun:stun1.l.google.com:19302' }],
			},
			debug: process.env.VUE_APP_ENV === 'production' ? 0 : 3,
			token,
		}

		state.peer = new Peer(payload)
		state.peer.on('open', (id) => {
			commit('setPeerId', id)
		})

		state.peer._socket.on('message', (data) => {
			if (data?.type == 'METADATA') {
				commit('updateUserMetadata', {
					id: data.id,
					metadata: data.metadata,
				})
			} else if (data?.type == 'METADATAS') {
				commit('updateUsersMetadata', data.metadata)
			}
		})

		state.peer._socket.on('close', (data) => {
			console.log('socket closed', data)
		})

		state.peer.on('call', (call) => {
			call.on('stream', (remoteStream) => {
				const myCallIndex = state.myCalls.indexOf(call.peer)

				if (myCallIndex === -1) {
					state.myCalls.push(call.peer)
				}

				const remoteStreamIndex = state.remoteStreams.findIndex(
					(item) => item.peer === call.peer
				)

				if (remoteStreamIndex === -1) {
					state.peer.connect(call.peer)
					state.peer.call(call.peer, state.myLocalVideoStream)
					state.remoteStreams.push({
						peer: call.peer,
						mute: false,
						stream: remoteStream,
					})
				}

				commit('setCallStatus', '')
			})

			const remoteStreamIndex = state.myCalls.findIndex(
				(item) => item === call.peer
			)

			if (remoteStreamIndex > -1) {
				call.answer()
				call.active = true
			} else {
				const callIndex = state.receiveCalls.findIndex(
					(item) => item.peer === call.peer
				)

				if (callIndex === -1) {
					state.receiveCalls.push(call)
				}
			}
		})

		state.peer.on('connection', (connection) => {
			connection.on('data', (data) => {
				if (data === 'PAIR_CLOSED') {
					commit('setCallStatus', 'User ended call')
					commit('close', connection.peer)
				}
			})

			connection.on('close', () => {
				console.log('connection closed by peer', connection.peer)
				commit('close', connection.peer)
			})

			state.receiveConnections.push(connection)
		})

		state.peer.on('error', (error) => {
			if (error.message.includes('Could not connect to peer')) {
				commit('setCallStatus', 'User is offline')
			}
		})
	},

	answerCall({ commit, state }, payload) {
		const addLocalStreamToRemoteStreams = () => {
			if (!state.remoteStreams.some((item) => item.peer === 'self')) {
				state.remoteStreams.push({
					peer: 'self',
					stream: state.myLocalVideoStream,
				})
			}
		}

		const handleIncomingCall = () => {
			const lastCall = state.receiveCalls[state.receiveCalls.length - 1]
			lastCall.answer()
			lastCall.active = true
			commit('removeReceiveCall', payload)
		}

		const handleExistingCall = (index) => {
			const call = state.receiveCalls[index]
			call.answer()
			call.active = true
			commit('removeReceiveCall', payload)
		}

		addLocalStreamToRemoteStreams()

		if (!payload) {
			handleIncomingCall()
		} else {
			const remoteStreamIndex = state.receiveCalls.findIndex(
				(item) => item.peer === payload
			)

			if (remoteStreamIndex !== -1) {
				handleExistingCall(remoteStreamIndex)
			}
		}
	},

	rejectCall({ commit, state }, payload) {
		const callToReject = payload
			? state.receiveCalls.find((item) => item.peer === payload)
			: state.receiveCalls[state.receiveCalls.length - 1]

		if (callToReject) {
			callToReject.close()
			commit('close', callToReject.peer)
		}
	},
}

const mutations = {
	reset({ commit, state }) {
		if (state.peer) {
			state.peer.destroy()
			state.peer = null
		}

		commit('setPeerId', '')
		commit('setVideoStream', null)
		commit('updateUsersMetadata', {})
	},

	setCallStatus(state, status) {
		state.callStatus = status
	},

	setPeerId(state, id) {
		state.id = id
	},

	setVideoStream(state, payload) {
		state.myLocalVideoStream = payload
	},

	updateUserMetadata(state, { id, metadata }) {
		state.usersMetadata = { ...state.usersMetadata, [id]: metadata }
	},

	updateUsersMetadata(state, metadata) {
		state.usersMetadata = metadata
	},

	removeReceiveCall(state, payload) {
		const index = state.receiveCalls.findIndex(
			(item) => item.peer === payload
		)
		state.receiveCalls.splice(index, 1)
	},

	close(state, connectId) {
		const callIndex = state.receiveCalls.findIndex(
			(item) => item.peer === connectId
		)
		const connectionIndex = state.receiveConnections.findIndex(
			(item) => item.peer === connectId
		)
		const remoteStreamIndex = state.remoteStreams.findIndex(
			(item) => item.peer === connectId
		)
		const myCallIndex = state.myCalls.findIndex(
			(item) => item.peer === connectId
		)

		if (callIndex !== -1) {
			state.receiveCalls[callIndex].close()
		}

		if (connectionIndex !== -1) {
			try {
				state.receiveConnections[connectionIndex].send('PAIR_CLOSED')
			} catch (e) {
				console.log('closed')
			}
			state.receiveConnections[connectionIndex].close()
		}

		state.remoteStreams.splice(remoteStreamIndex, 1)
		state.receiveConnections.splice(callIndex, 1)
		state.receiveCalls.splice(connectionIndex, 1)

		state.myCalls.splice(myCallIndex, 1)
	},
}

export default {
	namespaced: true,
	state: { ...initialState },
	getters,
	actions,
	mutations,
}

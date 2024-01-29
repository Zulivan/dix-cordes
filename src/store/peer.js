import Peer from 'peerjs'

export default {
	namespaced: true,
	state: {
		id: '',
		remoteId: '',
		peer: null,

		myLocalVideoStream: null,
		remoteStreams: [],
		receiveCalls: [],
		usersMetadata: {},
		receiveConnections: [],
		myConnections: [],
		myCalls: [],
	},
	getters: {
		getPeerId: (state) => {
			return state.id
		},
		getUserMetadata: (state) => (id) => {
			return state.usersMetadata[id]
		},
		getRemoteId: (state) => {
			return state.remoteId
		},
		getRemoteStreams: (state) => {
			return state.remoteStreams
		},
		getRemoteStreamsMetadata: (state) => {
			return state.remoteStreams.map((item) => {
				return state.usersMetadata[item.peer]
			})
		},
		getReceiveCalls: (state) => {
			return state.receiveCalls
		},
		getReceiveConnections: (state) => {
			return state.receiveConnections
		},
		getMyConnections: (state) => {
			return state.myConnections
		},
		getMyCalls: (state) => {
			return state.myCalls
		},
		getMyLocalVideoStream: (state) => {
			return state.myLocalVideoStream
		},
		getPeer: (state) => {
			return state.peer
		},
	},
	actions: {
		sendCallRequest: async function (context, payload) {
			await context.dispatch('initPeer', payload.token)

			// Add self to remote streams
			if (
				context.state.remoteStreams.filter(
					(item) => item.peer == 'self'
				).length == 0
			) {
				context.state.remoteStreams.push({
					peer: 'self',
					mute: true,
					stream: context.state.myLocalVideoStream,
				})
			}
			context.state.myCalls.push(payload.id)
			setTimeout(() => {
				context.state.peer.connect(payload.id)
				context.state.peer.call(
					payload.id,
					context.state.myLocalVideoStream
				)
			}, 100)
		},
		initPeer: async function (context, token) {
			if (context.state.peer) {
				context.state.peer.destroy()
				context.state.peer = null
			}
			const payload = {
				host: process.env.VUE_APP_PEER_SERVER_HOST,
				port: process.env.VUE_APP_PEER_SERVER_PORT,
				secure: process.env.VUE_APP_ENV == 'production',
				path: '/rtc',
				config: {
					iceServers: [{ url: 'stun:stun1.l.google.com:19302' }],
				},
				debug: process.env.VUE_APP_ENV == 'production' ? 0 : 3,
				token: token,
			}
			context.state.peer = new Peer(payload)
			context.state.peer.on('open', (id) => {
				context.state.id = id
			})

			context.state.peer._socket.on('message', (data) => {
				if (data?.type == 'METADATA') {
					context.state.usersMetadata[data.id] = data.metadata
				} else if (data?.type == 'METADATAS') {
					context.state.usersMetadata = {
						...context.state.usersMetadata,
						...data.metadata,
					}
				}
			})

			context.state.peer.on('call', (call) => {
				call.on('stream', (remoteStream) => {
					// Add to my calls if not already added
					let myCallIndex = context.state.myCalls.indexOf(call.peer)
					if (myCallIndex == -1) {
						context.state.myCalls.push(call.peer)
					}

					let remoteStreamIndex =
						context.state.remoteStreams.findIndex(
							(item) => item.peer == call.peer
						)
					if (remoteStreamIndex == -1) {
						context.state.peer.call(
							call.peer,
							context.state.myLocalVideoStream
						)
						context.state.remoteStreams.push({
							peer: call.peer,
							mute: false,
							stream: remoteStream,
						})
					}
				})

				// If call peer id is in my calls, answer the call
				let remoteStreamIndex = context.state.myCalls.findIndex(
					(item) => item == call.peer
				)

				if (remoteStreamIndex > -1) {
					call.answer(context.state.myLocalVideoStream)
				} else {
					// Check if call is already in receive calls
					let callIndex = context.state.receiveCalls.findIndex(
						(item) => item.peer == call.peer
					)
					if (callIndex != -1) return false

					context.state.receiveCalls.push(call)
				}
			})

			context.state.peer.on('connection', (connection) => {
				connection.on('data', (data) => {
					if (data == 'PAIR_CLOSED') {
						context.commit('close', connection.peer)
					}
				})
				connection.on('close', () => {
					context.commit('close', connection.peer)
				})

				context.state.receiveConnections.push(connection)
			})
			context.state.peer.on('error', (error) => {
				console.log(error)
			})
		},
		answerCall: function (context, payload) {
			const addLocalStreamToRemoteStreams = () => {
				if (
					context.state.remoteStreams.filter(
						(item) => item.peer === 'self'
					).length === 0
				) {
					context.state.remoteStreams.push({
						peer: 'self',
						stream: context.state.myLocalVideoStream,
					})
				}
			}

			const handleIncomingCall = () => {
				const lastCall =
					context.state.receiveCalls[
						context.state.receiveCalls.length - 1
					]
				lastCall.answer(context.state.myLocalVideoStream)
				lastCall.active = true
				context.commit('removeReceiveCall', payload)
			}

			const handleExistingCall = (index) => {
				const call = context.state.receiveCalls[index]
				call.answer(context.state.myLocalVideoStream)
				call.active = true
				context.commit('removeReceiveCall', payload)
			}

			addLocalStreamToRemoteStreams()

			if (!payload) {
				handleIncomingCall()
			} else {
				let remoteStreamIndex = context.state.receiveCalls.findIndex(
					(item) => item.peer === payload
				)
				if (remoteStreamIndex !== -1) {
					handleExistingCall(remoteStreamIndex)
				}
			}
		},
		rejectCall: function (context, payload) {
			let callToReject
			if (!payload) {
				callToReject =
					context.state.receiveCalls[
						context.state.receiveCalls.length - 1
					]
			} else {
				let remoteStreamIndex = context.state.receiveCalls.findIndex(
					(item) => item.peer == payload
				)
				callToReject = context.state.receiveCalls[remoteStreamIndex]
			}
			callToReject.close()
			context.commit('close', callToReject.peer)
		},
	},
	mutations: {
		setVideoStream(state, payload) {
			state.myLocalVideoStream = payload
		},
		removeReceiveCall(state, payload) {
			let index = state.receiveCalls.findIndex(
				(item) => item.peer == payload
			)
			state.receiveCalls.splice(index, 1)
		},
		close: function (state, connectId) {
			let callIndex = state.receiveCalls.findIndex(
				(item) => item.peer == connectId
			)
			let connectionIndex = state.receiveConnections.findIndex(
				(item) => item.peer == connectId
			)
			let remoteStreamIndex = state.remoteStreams.findIndex(
				(item) => item.peer == connectId
			)

			let myConnectionIndex = state.myConnections.findIndex(
				(item) => item.peer == connectId
			)
			let myCallIndex = state.myCalls.findIndex(
				(item) => item.peer == connectId
			)

			if (myConnectionIndex != -1)
				state.myConnections[myConnectionIndex].send('PAIR_CLOSED')

			if (callIndex != -1) state.receiveCalls[callIndex].close()
			if (connectionIndex != -1)
				state.receiveConnections[connectionIndex].close()

			state.remoteStreams.splice(remoteStreamIndex, 1)
			state.receiveConnections.splice(callIndex, 1)
			state.receiveCalls.splice(connectionIndex, 1)

			state.myCalls.splice(myCallIndex, 1)
			state.myConnections.splice(myConnectionIndex, 1)
		},
		call: function (state, connectId) {
			if (
				state.myConnections.findIndex(
					(item) => item.peer == connectId
				) != -1
			)
				return false
			if (state.myCalls.findIndex((item) => item.peer == connectId) != -1)
				return false

			let call = state.peer.call(connectId, state.myLocalVideoStream)

			let dataConnection = state.peer.connect(connectId)

			state.myConnections.push(dataConnection)
			state.myCalls.push(call)
		},
	},
	modules: {},
}

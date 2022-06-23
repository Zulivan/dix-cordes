import SocketIO from 'socket.io-client'

class Socket {
	constructor(store) {
		this.socket = null
		this.store = store
	}

	async connectAsync(token) {
		return new Promise(function (resolve, reject) {
			const io = SocketIO(process.env.VUE_APP_SOCKET_URL, {
				extraHeaders: { Authorization: `Bearer ${token}` },
				reconnection: true,
				reconnectionDelay: 500,
				reconnectionAttempts: 100,
			})
			io.on('connect', function () {
				resolve(io)
			})
			io.on('connect_error', function () {
				reject(new Error('connect_error'))
			})
			io.on('connect_timeout', function () {
				reject(new Error('connect_timeout'))
			})
		})
	}

	async init(token) {
		if (this.socket) {
			console.log('Socket déjà activée')
			return this.socket
		}

		try {
			this.socket = await this.connectAsync(token)
		} catch (e) {
			const pl = {
				reason: 'Connexion impossible serveur Socket.io',
				details: e.message,
			}
			this.store.dispatch('user/makeError', pl, { root: true })
		}

		this.socket.on('connect', () => {
			this.store.dispatch('user/makeError', null, { root: true })
		})

		this.socket.on('disconnect', () => {
			const pl = {
				reason: 'Déconnection du serveur Socket.io',
				details:
					'Merci de patienter le temps que la connexion se rétablisse.',
			}
			this.store.dispatch('user/makeError', pl, { root: true })
		})

		this.socket.onAny((event, pl) => {
			this.store.dispatch(event, pl, { root: true })
		})

		return this.socket
	}
}

export default Socket

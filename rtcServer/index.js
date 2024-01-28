import { ExpressPeerServer } from 'peer'
import { peerjsAuth } from '../jwt.js'

class RTCServer {
  constructor(server) {
    this.peerServer = ExpressPeerServer(server, {
      debug: true,
    })

    this.clients = {}

    this.init()
  }

  init() {
    this.peerServer.on('connection', async function (client) {
      const userInfo = await peerjsAuth(client)
      if (!userInfo) return
      this.clients[userInfo.id] = client
    })
    this.peerServer.on('disconnect', (client) => {
      console.log('disconnect', client)
      delete this.clients[client.id]
    })
  }
}

export default RTCServer

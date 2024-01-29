import { ExpressPeerServer } from 'peer'
import { peerjsAuth } from '../jwt.js'
import { getRelay } from '../utils/index.js'
import { updateStatus, getUserById } from '../apiServer/methods/user.js'
class RTCServer {
  constructor(server) {
    this.peerServer = ExpressPeerServer(server, {
      debug: true,
    })

    this.server = server

    this.clients = {}
    this.metadatas = {}

    this.init()
  }

  init() {
    const self = this
    this.peerServer.on('connection', async function (client) {
      const userInfo = await peerjsAuth(client)
      if (!userInfo) return

      const peerRelay =
        getRelay(client, process.env.PORT_PEER) + '|' + client.id
      await updateStatus(userInfo.id, { peerjsrelay: peerRelay })

      console.log('connected client', client.id, userInfo.nickname)

      const metadata = {
        id: userInfo.id,
        nickname: userInfo.nickname,
        avatar: userInfo.avatar,
      }

      for (const id in self.clients) {
        const rec = self.clients[id]
        rec.send({
          type: 'METADATA',
          id: client.id,
          metadata,
        })
      }

      client.send({
        type: 'METADATAS',
        metadata: self.metadatas,
      })

      self.metadatas[client.id] = metadata
      self.clients[userInfo.id] = client
    })
    this.peerServer.on('disconnect', (client) => {
      console.log('disconnect', client.id)
      delete self.clients[client.id]
      delete self.metadatas[client.id]
    })
  }
}

export default RTCServer

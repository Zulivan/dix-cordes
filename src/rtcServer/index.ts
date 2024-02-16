import { ExpressPeerServer } from 'peer'
import { peerjsAuth } from '../jwt'
import { getRelay } from '../utils/index'
import { updateStatus, getUserById } from '../apiServer/methods/user'
import http from 'http'
import express from 'express'

interface UserPayload {
  id: string
  nickname: string
  avatar: string
}

class RTCServer {
  public peerServer: express.Express
  private server: http.Server
  private clients: { [key: string]: any }
  private metadatas: { [key: string]: any }

  constructor(server: http.Server) {
    this.peerServer = ExpressPeerServer(server as http.Server)

    this.server = server

    this.clients = {}
    this.metadatas = {}

    this.init()
  }

  private async init() {
    const self = this
    this.peerServer.on('connection', async function (client: any) {
      const userInfo = await peerjsAuth(client)
      if (!userInfo) return

      const peerRelay =
        getRelay(client, Number(process.env.PORT_PEER)) + '|' + client.id
      await updateStatus(Number(userInfo.id), { peerjsrelay: peerRelay })

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
    this.peerServer.on('disconnect', (client: any) => {
      console.log('disconnect', client.id)
      delete self.clients[client.id]
      delete self.metadatas[client.id]
    })
  }
}

export default RTCServer

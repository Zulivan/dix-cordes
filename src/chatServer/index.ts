import { Server } from 'http'
import { Server as SocketIOServer, Socket } from 'socket.io'
import { socketIOAuth } from '../jwt.js'
import { updateStatus, getUserById } from '../apiServer/methods/user'
import { getRelay } from '../utils/index.js'

interface UserPayload {
  id: number
  nickname: string
  avatar: string
}

class ChatServer {
  public io: SocketIOServer
  private server: Server
  private sockets: { [userId: string]: Socket }

  constructor(server: Server) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: '*',
        credentials: true,
      },
    })

    this.server = server

    this.sockets = {}

    this.init()
  }

  public get(userId: string): Socket {
    return this.sockets[userId]
  }

  private log(message: string, val: string): void {
    // console.log('[SOCKET]', message, val)
  }

  private async init(): Promise<void> {
    const self = this
    const port = process.env.PORT
    this.io.on('connection', async function (socket: Socket) {
      const userInfo = (await socketIOAuth(socket)) as UserPayload
      if (!userInfo) {
        socket.emit('user/logout', true)
        return socket.disconnect(true)
      }
      self.log('Connected: ', userInfo.id + ' ')
      self.log('List: ', Object.keys(self.sockets) + ' ')
      self.sockets[userInfo.id] = socket

      const socketRelay = getRelay(socket, Number(port)) + '|' + userInfo.id
      await updateStatus(userInfo.id, { socketrelay: socketRelay, status: 1 })

      const userObj = await getUserById(userInfo.id)
      self.io.emit('contacts/receiveContactUpdate', userObj)

      socket.on('disconnect', async () => {
        await updateStatus(userInfo.id, { status: 4 })
        const userObj = await getUserById(userInfo.id)
        self.io.emit('contacts/receiveContactUpdate', userObj)
        delete self.sockets[userInfo.id]
      })
    })
  }
}

export default ChatServer

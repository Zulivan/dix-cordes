// eslint-disable-next-line new-cap
import httpServ from 'http'
import * as sio from 'socket.io'
import { socketIOAuth } from '../jwt.js'
import { updateStatus, getUserById } from '../apiServer/methods/user.js'

/** socketServeur instance
 */
class ChatServer {
  /** Initialise
   * @param {object} app Objet app
   * @return {void}
   */
  constructor(app) {
    // eslint-disable-next-line new-cap
    const http = httpServ.Server(app)

    this.io = new sio.Server(http, {
      cors: {
        origin: '*',
        credentials: true,
      },
    })

    http.listen(process.env.PORT)

    console.log(http.address())

    this.sockets = {}

    this.init()
  }

  /** Get socket
   * @param {string} userId userId
   * @return {object}
   */
  get(userId) {
    return this.sockets[userId]
  }

  /** Message socket
   * @param {string} message messsage
   * @param {string} val val
   * @return {void}
   */
  log(message, val) {
    // console.log('[SOCKET]', message, val)
  }

  /** Initialise
   * @return {void}
   */
  init() {
    const self = this

    this.io.on('connection', async function (socket) {
      const userInfo = await socketIOAuth(socket)
      if (!userInfo) {
        socket.emit('user/logout', true)
        return socket.disconnect(true)
      }

      self.log('Connecté :', userInfo)
      self.log('Liste', self.sockets)
      self.sockets[userInfo.id] = socket

      await updateStatus(userInfo.id, { status: 1 })
      const userObj = await getUserById(userInfo.id)
      self.io.emit('contacts/receiveContactUpdate', userObj)

      socket.on('disconnect', async () => {
        await updateStatus(userInfo.id, { status: 4 })
        const userObj = await getUserById(userInfo.id)
        self.io.emit('contacts/receiveContactUpdate', userObj)
      })
    })
  }
}

export default ChatServer

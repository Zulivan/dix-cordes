import auth from './routes/auth.js'
import user from './routes/user.js'
import conversations from './routes/conversations.js'
import contacts from './routes/contacts.js'

import express from 'express'

/** ApiServer instance
 */
class APIServer {
  /** Initialise
   * @return {void}
   */
  constructor() {
    this.app = express()

    this.init()
  }

  /** Les sockets
   * @param {object} socket Socket
   * @return {void}
   */
  defineSocket(socket) {
    conversations.socket = socket
    user.socket = socket
  }

  /** Initialise
   * @return {void}
   */
  init() {
    this.setUses()

    // STANDARD API RESPONSE
    this.app.response.apiStatus = function (data, statusCode = 200) {
      return this.status(200).send({
        status: statusCode,
        error: statusCode !== 200,
        output: data,
      })
    }

    this.app.get('/', (req, res) => {
      res.send('Dix-cordes API v1.0')
    })

    // const confServeur = config.get('serveur')

    // this.app.listen(process.env.PORT || confServeur.port, function () {})
  }

  /** set uses
   * @return {void}
   */
  setUses() {
    // JSON
    this.app.use(express.json())

    // CORS ALLOW
    this.app.use(function (req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', '*')

      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE'
      )

      res.setHeader(
        'Access-Control-Allow-Headers',
        'Authorization,X-Requested-With,content-type'
      )

      res.setHeader('Access-Control-Allow-Credentials', true)

      next()
    })

    // ROUTES
    this.app.use('/auth', auth)
    this.app.use('/user', user.router)
    this.app.use('/contacts', contacts)
    this.app.use('/conversations', conversations.router)
  }
}

export default APIServer

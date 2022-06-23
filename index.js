import ChatServer from './chatServer/index.js'
import APIServer from './apiServer/index.js'

const http = new APIServer()

// SERVEUR SOCKET IO

const socketServer = new ChatServer(http.app)

http.defineSocket(socketServer)

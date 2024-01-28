import ChatServer from './chatServer/index.js'
import APIServer from './apiServer/index.js'
import RTCServer from './rtcServer/index.js'

const http = new APIServer()

const socketServer = new ChatServer(http.server)
http.defineSocket(socketServer)

const rtcServer = new RTCServer(http.server)
http.app.use('/rtc', rtcServer.peerServer)

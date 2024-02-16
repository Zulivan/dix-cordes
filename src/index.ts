import ChatServer from './chatServer/index.js'
import APIServer from './apiServer/index.js'
import RTCServer from './rtcServer/index.js'
import httpServer from 'http'

const http: APIServer = new APIServer()
const SERVER_TYPES: string = process.env.SERVER_TYPES || 'api,socket,peerjs'

// Live chat instance
if (SERVER_TYPES.includes('global') || SERVER_TYPES.includes('socket')) {
  const server: httpServer.Server = httpServer.createServer(http.app)
  server.listen(process.env.PORT || 3000)

  const socketServer: ChatServer = new ChatServer(server)
  http.defineSocket(socketServer)
}

// RTC Instance
if (SERVER_TYPES.includes('global') || SERVER_TYPES.includes('peerjs')) {
  const server2: httpServer.Server = httpServer.createServer(http.app)
  server2.listen(process.env.PORT_PEER || process.env.PORT || 3001)

  const rtcServer: RTCServer = new RTCServer(server2)
  http.app.use('/rtc', rtcServer.peerServer)
}

function getLocalIpAddress() {
  const networkInterfaces = os.networkInterfaces()
  let localIpAddress

  Object.keys(networkInterfaces).forEach((key) => {
    networkInterfaces[key].forEach((iface) => {
      if (!iface.internal && iface.family === 'IPv4') {
        localIpAddress = iface.address
      }
    })
  })

  return localIpAddress
}

function getRelay(socket, port) {
  const isReverseProxy =
    socket?.handshake?.headers['x-forwarded-for'] !== undefined

  const ipAddress =
    process.env.IP_ADDRESS ||
    (isReverseProxy ? req?.headers?.host : getLocalIpAddress())

  const relay = ipAddress + ':' + port

  return relay
}

export { getRelay, getLocalIpAddress }

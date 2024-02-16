import os from 'os'

function getLocalIpAddress(): string | undefined {
  const networkInterfaces: { [key: string]: os.NetworkInterfaceInfo[] } =
    (os.networkInterfaces() || {}) as {
      [key: string]: os.NetworkInterfaceInfo[]
    }
  let localIpAddress: string | undefined

  Object.keys(networkInterfaces).forEach((key) => {
    networkInterfaces[key].forEach((iface) => {
      if (!iface.internal && iface.family === 'IPv4') {
        localIpAddress = iface.address
      }
    })
  })

  return localIpAddress
}

function getRelay(socket: any, port: number): string {
  const isReverseProxy: boolean =
    socket?.handshake?.headers['x-forwarded-for'] !== undefined

  const host: string | undefined =
    socket?.handshake?.headers?.host.split(':').shift() || getLocalIpAddress()

  const ipAddress: string | undefined =
    process.env.IP_ADDRESS || (isReverseProxy ? host : getLocalIpAddress())

  const relay: string = ipAddress + ':' + port

  return relay
}

export { getRelay, getLocalIpAddress }

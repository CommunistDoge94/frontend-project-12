import { io } from 'socket.io-client'

const socket = io()

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect()
  }
}

export default socket

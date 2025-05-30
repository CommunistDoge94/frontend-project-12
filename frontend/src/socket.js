import { io } from 'socket.io-client'

const socket = io({
  auth: {},
})

export default socket

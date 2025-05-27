import { io } from 'socket.io-client';

const socket = io({
  autoConnect: false,
  path: '/socket.io',
  transports: ['websocket'],
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export default socket;

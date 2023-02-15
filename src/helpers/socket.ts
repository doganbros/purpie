import { io } from 'socket.io-client';
import { addUserOnline, removeUserOnline } from '../store/actions/chat.action';
import { store } from '../store/store';

interface SocketInfo {
  socketId: string;
  userId: number;
}

const options = {
  autoConnect: false,
  withCredentials: true,
};

export const socket =
  process.env.NODE_ENV === 'development'
    ? io(process.env.REACT_APP_SERVER_HOST || 'http://localhost:4000', options)
    : io(options);

export const initializeSocket = (): void => {
  socket.connect();

  socket.on('contact_user_connected', (userId: number) => {
    store.dispatch(addUserOnline(userId));
    socket.emit('send_presence', userId);
  });

  socket.on('presence', (userId: number) => {
    store.dispatch(addUserOnline(userId));
  });

  socket.on('socket_disconnected', (socketInfo: SocketInfo) => {
    removeUserOnline(socketInfo.userId);
  });
};

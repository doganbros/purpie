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
  extraHeaders: {
    authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250ZXh0Ijp7InVzZXIiOnsiYXZhdGFyIjoiaHR0cDovL29jdG9wdXMubG9jYWxob3N0OjgwMDAvdjEvdXNlci9kaXNwbGF5LXBob3RvL2Q0YmY2MDdlLWRmNjMtNDQ5My1iNWMwLThjZjM5MGQ0MjdmNi5qcGVnIiwibmFtZSI6Ik1laG1ldCBBUklDSSIsImVtYWlsIjoibWVobWV0YXJpY2lzdGRAZ21haWwuY29tIiwiaWQiOjEsInJvb20iOiJjYmwtYmo4LW0wNV9sb2NhbC5tZSIsImxvYmJ5X2J5cGFzcyI6dHJ1ZX0sImdyb3VwIjoiYTEyMi0xMjMtNDU2LTc4OSJ9LCJtb2RlcmF0b3IiOnRydWUsImV4cCI6MTY5NjI4NDA1MiwiYXVkIjoiZG9nYW5icm9zLW1lZXQiLCJpc3MiOiJkb2dhbmJyb3MtbWVldCIsIm5iZiI6MTU5NjE5NzY1Miwicm9vbSI6ImNibC1iajgtbTA1X2xvY2FsLm1lIiwic3ViIjoibWVldC5wdXJwaWUuaW8iLCJpYXQiOjE2NzIxNzE1MTB9.sHO_7PyKYpbOk3c-BosbUvaFfl-0usakElSvJme0kEw',
  },
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

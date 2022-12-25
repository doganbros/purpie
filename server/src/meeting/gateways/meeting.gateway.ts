import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface SocketWithTokenPayload extends Socket {
  user: {
    id: number;
  };
}

const { REACT_APP_CLIENT_HOST = '' } = process.env;

@WebSocketGateway(8081, {
  cors: {
    origin: [
      new RegExp(
        `(\\b|\\.)${new URL(REACT_APP_CLIENT_HOST).host.replace(
          /\./g,
          '\\.',
        )}$`,
      ),
      'http://localhost:3000',
      'http://octopus.localhost:3000',
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  },
  namespace: '/jitsi',
})
export class MeetingGateway {
  @WebSocketServer() io: Server;

  @SubscribeMessage('test')
  handleMessageDeleted(
    @ConnectedSocket() socket: SocketWithTokenPayload,
    @MessageBody()
    payload: {
      data: string;
    },
  ) {
    console.log('DATA RECEIVED: ', payload.data, ' SOCKET: ', socket);
    return 'OK';
  }
}

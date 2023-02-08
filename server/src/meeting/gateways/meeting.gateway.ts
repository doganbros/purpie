import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MeetingService } from '../services/meeting.service';
import { ErrorTypes } from '../../../types/ErrorTypes';

interface SocketWithTokenPayload extends Socket {
  user: {
    avatar: string;
    name: string;
    email: string;
    id: number;
    room: string;
    lobby_bypass: boolean;
  };
}

const { REACT_APP_CLIENT_HOST = '' } = process.env;

@WebSocketGateway({
  cors: {
    origin: [
      new RegExp(
        `(\\b|\\.)${new URL(REACT_APP_CLIENT_HOST).host.replace(
          /\./g,
          '\\.',
        )}$`,
      ),
      'https://meet.purpie.io',
      'http://localhost:3000',
      'http://purpie.localhost:3000',
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  },
  namespace: '/',
})
export class MeetingGateway {
  @WebSocketServer() io: Server;

  constructor(private meetingService: MeetingService) {}

  @SubscribeMessage('test')
  handleMessageDeleted(
    @ConnectedSocket() socket: SocketWithTokenPayload,
    @MessageBody()
    payload: {
      data: string;
    },
  ) {
    const roomName = socket.user.room;
    if (!socket.rooms.has(roomName))
      throw new WsException(ErrorTypes.NOT_AUTHORIZED);

    return payload;
  }

  async handleConnection(socket: SocketWithTokenPayload) {
    try {
      const token = socket.handshake.headers.authorization;

      const jwtToken = token?.split(' ')[1];
      const payload = await this.meetingService.verifyJitsiToken(jwtToken!);

      if (!payload) return null;
      socket.user = payload.context.user;
      const meetingSlug = socket.user.room;

      socket.join(meetingSlug);

      socket.emit(
        'meeting_info',
        await this.meetingService.getConferenceInfo(
          meetingSlug,
          socket.user.id,
        ),
      );

      socket.on('disconnecting', () => this.handleDisconnecting(socket));
      return null;
    } catch (err) {
      return null;
    }
  }

  async handleDisconnecting(socket: SocketWithTokenPayload) {
    try {
      socket.leave(socket.user.room);
    } catch (error) {
      //
    }
  }
}

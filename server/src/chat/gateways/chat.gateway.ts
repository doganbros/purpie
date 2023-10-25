import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { nanoid } from 'nanoid/async';
import { Server, Socket } from 'socket.io';
import { PostService } from 'src/post/services/post.service';
import { ChatMessageDto } from '../dto/chat-message.dto';
import { ChatService } from '../services/chat.service';
import { ErrorTypes } from '../../../types/ErrorTypes';
import { UserLogService } from '../../log/services/user-log.service';
import {
  generateLowerAlphaNumId,
  separateString,
} from '../../../helpers/utils';
import { MeetingService } from '../../meeting/services/meeting.service';
import { AuthService } from '../../auth/services/auth.service';

interface SocketWithTokenPayload extends Socket {
  user: {
    id: string;
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
      'http://localhost:3000',
      'http://purpie.localhost:3000',
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  },
  namespace: '/',
})
export class ChatGateway {
  @WebSocketServer() io: Server;

  constructor(
    private chatService: ChatService,
    private postService: PostService,
    private userLogService: UserLogService,
    private meetingService: MeetingService,
    private authService: AuthService,
  ) {}

  @SubscribeMessage('delete_message')
  async handleMessageDeleted(
    @ConnectedSocket() socket: SocketWithTokenPayload,
    @MessageBody()
    payload: {
      identifier: string;
      to: string;
      medium: 'direct' | 'channel' | 'post';
    },
  ) {
    const roomName = this.chatService.getRoomName(payload.to, payload.medium);
    const result = await this.chatService.removeChatMessage(
      payload.identifier,
      socket.user.id,
    );
    if (!result) throw new WsException(ErrorTypes.MESSAGE_NOT_DELETED);

    socket.to(roomName).emit('message_deleted', { ...payload, roomName });

    return payload;
  }

  @SubscribeMessage('message')
  async handleNewMessage(
    @ConnectedSocket() socket: SocketWithTokenPayload,
    @MessageBody()
    payload: ChatMessageDto,
  ) {
    const roomName = this.chatService.getRoomName(payload.to, payload.medium);
    if (!socket.rooms.has(roomName))
      throw new WsException(ErrorTypes.NOT_AUTHORIZED);

    const isEdit = !!payload.identifier;

    if (!isEdit) payload.identifier = await nanoid();
    else payload.edited = true;

    payload.createdOn = new Date();
    payload.roomName = roomName;

    socket.to(roomName).emit('new_message', payload);

    await this.chatService.saveChatMessage(socket.user.id, payload, isEdit);

    return payload;
  }

  @SubscribeMessage('join_post')
  async joinPost(
    @ConnectedSocket() socket: SocketWithTokenPayload,
    @MessageBody() postId: string,
  ) {
    const roomName = this.chatService.getRoomName(postId, 'post');
    const post = await this.postService.getOnePost(
      socket.user.id,
      postId,
      null,
    );

    if (!post) throw new WsException(ErrorTypes.POST_NOT_FOUND);

    await socket.join(roomName);

    socket.to(roomName).emit('new_user_joined_post', {
      socketId: socket.id,
      userId: socket.user.id,
    });

    await this.chatService.addCurrentStreamViewer(socket.user.id, postId);
    const currentStreamViewersCount = await this.chatService.getTotalNumberOfStreamViewers(
      postId,
    );

    socket
      .to(roomName)
      .emit('stream_viewer_count_change', currentStreamViewersCount);

    return postId;
  }

  @SubscribeMessage('leave_post')
  async leavePost(
    @ConnectedSocket() socket: SocketWithTokenPayload,
    @MessageBody() postId: string,
  ) {
    const roomName = this.chatService.getRoomName(postId, 'post');

    socket.to(roomName).emit('user_left_post', {
      socketId: socket.id,
      userId: socket.user.id,
    });

    await this.chatService.removeCurrentStreamViewer(socket.user.id, postId);
    const counter = await this.chatService.getTotalNumberOfStreamViewers(
      postId,
    );

    socket.to(roomName).emit('stream_viewer_count_change', { counter, postId });

    await socket.leave(roomName);
  }

  @SubscribeMessage('join_call')
  async startCall(
    @ConnectedSocket() socket: SocketWithTokenPayload,
    @MessageBody() userId: string,
  ) {
    const roomName = this.chatService.getRoomName(userId);

    const meetingRoomName = separateString(generateLowerAlphaNumId(9), 3);
    const user = await this.authService.getUserProfile(userId);
    const meetingToken = await this.meetingService.generateMeetingToken(
      meetingRoomName,
      user,
      false,
      24,
    );
    socket.to(roomName).emit('call_started', {
      socketId: socket.id,
      userId: socket.user.id,
      meetingRoomName,
      meetingToken,
    });
  }

  @SubscribeMessage('leave_call')
  async leaveCall(
    @ConnectedSocket() socket: SocketWithTokenPayload,
    @MessageBody() userId: string,
  ) {
    const roomName = this.chatService.getRoomName(userId);

    socket.to(roomName).emit('call_ended', {
      roomName,
      userId: socket.user.id,
    });
  }

  @SubscribeMessage('join_direct_user')
  async joinDirectUser(
    @ConnectedSocket() socket: SocketWithTokenPayload,
    @MessageBody() userId: string,
  ) {
    await this.handleConnection(socket, userId);

    return userId;
  }

  @SubscribeMessage('leave_direct_user')
  async leaveDirectUser(
    @ConnectedSocket() socket: SocketWithTokenPayload,
    @MessageBody() userId: string,
  ) {
    const roomName = this.chatService.getRoomName(userId, 'direct');

    socket.to(roomName).emit('user_left', {
      socketId: socket.id,
      userId: socket.user.id,
    });
    await socket.leave(roomName);
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() socket: SocketWithTokenPayload,
    @MessageBody()
    payload: {
      to: string;
      user: Record<string, any>;
      medium: 'direct' | 'post' | 'channel';
    },
  ) {
    const roomName = this.chatService.getRoomName(payload.to, payload.medium);
    if (!socket.rooms.has(roomName))
      throw new WsException(ErrorTypes.NOT_AUTHORIZED);

    socket.to(roomName).emit('typing', {
      socketId: socket.id,
      to: payload.to,
      medium: payload.medium,
      roomName,
      user: {
        ...payload.user,
        id: socket.user.id,
      },
    });
  }

  @SubscribeMessage('send_presence')
  async announcePresenceToContact(
    @ConnectedSocket() socket: SocketWithTokenPayload,
    @MessageBody() to: string,
  ) {
    const roomName = this.chatService.getRoomName(to);
    if (!socket.rooms.has(roomName))
      throw new WsException(ErrorTypes.NOT_AUTHORIZED);

    socket.to(roomName).emit('presence', socket.user.id);
  }

  async handleConnection(socket: SocketWithTokenPayload, userId: string) {
    try {
      const currentUser = await this.chatService.getCurrentUser(socket);

      if (!currentUser) return null;
      socket.user = currentUser;

      socket.join(this.chatService.getRoomName(socket.user.id));

      await this.chatService.updateMessageReadOn(
        userId,
        socket.user.id,
        new Date(),
      );

      const contactIds = await this.chatService.fetchUserContactUserIds(
        socket.user.id,
      );

      contactIds.forEach((contactId) => {
        const contactRoomName = this.chatService.getRoomName(contactId);
        socket.join(contactRoomName);

        socket
          .to(contactRoomName)
          .emit('contact_user_connected', socket.user.id);
      });

      // Will be implmented when channel chat is needed.
      // const channelIds = await this.chatService.fetchUserChannelIds(
      //   socket.user.id,
      // );

      // channelIds.forEach((channelId) => {
      // socket.join(this.chatService.getRoomName(channelId, 'channel'));
      // });

      socket.on('disconnect', () => this.handleDisconnecting(socket));
      return null;
    } catch (err) {
      return null;
    }
  }

  async handleDisconnecting(socket: SocketWithTokenPayload) {
    try {
      socket.removeAllListeners();
      await this.userLogService.upsertUserOnlineDate(socket.user.id);
      const contactIds = await this.chatService.fetchUserContactUserIds(
        socket.user.id,
      );

      contactIds.forEach((contactId) => {
        socket
          .to(this.chatService.getRoomName(contactId))
          .emit('socket_disconnected', {
            socketId: socket.id,
            userId: socket.user.id,
          });
      });
    } catch (error) {
      //
    }
  }
}

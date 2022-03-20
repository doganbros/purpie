import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { nanoid } from 'nanoid/async';
import { Socket, Server } from 'socket.io';
import { PostService } from 'src/post/services/post.service';
import { ChatMessageDto } from '../dto/chat-message.dto';
import { ChatService } from '../services/chat.service';

interface SocketWithTokenPayload extends Socket {
  user: {
    id: number;
  };
}

const { REACT_APP_CLIENT_HOST = '' } = process.env;

@WebSocketGateway({
  cors: {
    origin: new RegExp(
      `(\\b|\\.)${new URL(REACT_APP_CLIENT_HOST).host.replace(/\./g, '\\.')}$`,
    ),
    credentials: true,
  },
  namespace: '/',
})
export class ChatGateway {
  @WebSocketServer() io: Server;

  constructor(
    private chatService: ChatService,
    private postService: PostService,
  ) {}

  @SubscribeMessage('delete_message')
  async handleMessageDeleted(
    @ConnectedSocket() socket: SocketWithTokenPayload,
    @MessageBody()
    payload: {
      identifier: string;
      to: number | string;
      medium: string;
    },
  ) {
    const result = await this.chatService.removeChatMessage(
      payload.identifier,
      socket.user.id,
    );
    if (!result) throw new WsException('Could not delete message');

    socket.to(payload.to.toString()).emit('message_deleted', payload);

    return payload;
  }

  @SubscribeMessage('message')
  async handleNewMessage(
    @ConnectedSocket() socket: SocketWithTokenPayload,
    @MessageBody()
    payload: ChatMessageDto,
  ) {
    if (!socket.rooms.has(payload.to.toString()))
      throw new WsException('Not Authorized');

    const isEdit = !!payload.identifier;

    if (!isEdit) payload.identifier = await nanoid();
    else payload.edited = true;

    payload.createdOn = new Date();

    socket.to(payload.to.toString()).emit('new_message', payload);

    await this.chatService.saveChatMessage(socket.user.id, payload, isEdit);

    return payload;
  }

  @SubscribeMessage('join_post')
  async joinPost(
    @ConnectedSocket() socket: SocketWithTokenPayload,
    @MessageBody() postId: number,
  ) {
    const post = await this.postService.getOnePost(socket.user.id, postId);

    if (!post) throw new WsException('Post not found');

    await socket.join(postId.toString());

    socket.to(postId.toString()).emit('new_user_joined_post', {
      socketId: socket.id,
      userId: socket.user.id,
    });
    // Track no. of users who have joined post

    return postId;
  }

  @SubscribeMessage('leave_post')
  async leavePost(
    @ConnectedSocket() socket: SocketWithTokenPayload,
    @MessageBody() postId: number,
  ) {
    socket.to(postId.toString()).emit('user_left_post', {
      socketId: socket.id,
      userId: socket.user.id,
    });
    await socket.leave(postId.toString());
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() socket: SocketWithTokenPayload,
    @MessageBody() payload: { to: string | number; user: Record<string, any> },
  ) {
    if (!socket.rooms.has(payload.to.toString()))
      throw new WsException('Not Authorized');

    socket.to(payload.to.toString()).emit('typing', {
      socketId: socket.id,
      to: payload.to,
      user: {
        ...payload.user,
        id: socket.user.id,
      },
    });
  }

  async handleDisconnecting(socket: SocketWithTokenPayload) {
    const contactIds = await this.chatService.fetchUserContactUserIds(
      socket.user.id,
    );

    contactIds.forEach((contactId) => {
      socket.to(contactId.toString()).emit('socket_disconnected', {
        socketId: socket.id,
        userId: socket.user.id,
      });
    });
  }

  @SubscribeMessage('send_presence')
  async announcePresenceToContact(
    @ConnectedSocket() socket: SocketWithTokenPayload,
    @MessageBody() to: string | number,
  ) {
    if (!socket.rooms.has(to.toString()))
      throw new WsException('Not Authorized');

    socket.to(to.toString()).emit('presence', socket.user.id);
  }

  async handleConnection(socket: SocketWithTokenPayload) {
    const currentUser = await this.chatService.getCurrentUser(socket);
    socket.user = currentUser;

    socket.join(socket.user.id.toString());

    const contactIds = await this.chatService.fetchUserContactUserIds(
      socket.user.id,
    );

    contactIds.forEach((contactId) => {
      socket.join(contactId.toString());
      socket
        .to(contactId.toString())
        .emit('contact_user_connected', socket.user.id);
    });

    // Will be implmented when channel chat is needed.
    // const channelIds = await this.chatService.fetchUserChannelIds(
    //   socket.user.id,
    // );

    // channelIds.forEach((channelId) => {
    //   socket.join(channelId.toString());
    // });

    socket.on('disconnecting', () => this.handleDisconnecting(socket));
  }
}

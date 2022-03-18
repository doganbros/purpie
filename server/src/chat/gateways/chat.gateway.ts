import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { PostService } from 'src/post/services/post.service';
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

  @SubscribeMessage('message_deleted')
  async handleMessageDeleted(
    @ConnectedSocket() socket: SocketWithTokenPayload,
    @MessageBody()
    payload: {
      id: number;
      to: number | string;
    },
  ) {
    const result = await this.chatService.removeChatMessage(
      payload.id,
      socket.user.id,
    );

    if (!result) throw new WsException('Could not delete message');
    socket.to(payload.id.toString()).emit('message_deleted', payload);
  }

  @SubscribeMessage('message')
  async handleNewMessage(
    @ConnectedSocket() socket: SocketWithTokenPayload,
    @MessageBody()
    payload: {
      message: string;
      to: number;
      parentMessage?: string;
      parentCreatedBy?: string;
      parentCreatedOn?: string;
      parentCreatedByFullName?: string;
    },
  ) {
    socket.to(payload.to.toString()).emit('new_message', payload);

    return this.chatService.saveChatMessage(socket.user.id, payload);
  }

  @SubscribeMessage('join_post')
  async joinPost(
    @ConnectedSocket() socket: SocketWithTokenPayload,
    @MessageBody() postId: number,
  ) {
    const post = await this.postService.getOnePost(socket.user.id, postId);

    if (!post) throw new WsException('Post not found');

    socket.join(postId.toString());

    socket.to(postId.toString()).emit('new_user_joined_post', {
      socketId: socket.id,
      userId: socket.user.id,
    });
    // Track no. of users who have joined post

    return postId;
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() socket: SocketWithTokenPayload,
    @MessageBody() to: string | number,
  ) {
    socket.to(to.toString()).emit('typing', {
      socketId: socket.id,
      userId: socket.user.id,
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

  async handleConnection(socket: SocketWithTokenPayload) {
    const currentUser = await this.chatService.getCurrentUser(socket);
    socket.user = currentUser;

    socket.join(socket.user.id.toString());

    const contactIds = await this.chatService.fetchUserContactUserIds(
      socket.user.id,
    );

    contactIds.forEach((contactId) => {
      socket.join(contactId.toString());
      socket.to(contactId.toString()).emit('new_socket_connected', {
        socketId: socket.id,
        userId: socket.user.id,
      });
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

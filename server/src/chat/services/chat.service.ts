import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from 'entities/Contact.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import cookie from 'cookie';
import { WsException } from '@nestjs/websockets';
import { verifyJWT } from 'helpers/jwt';
import { pick } from 'lodash';
import { AuthService } from 'src/auth/services/auth.service';
import { ChatMessage } from 'entities/ChatMessage.entity';
import { ChatMessageDto } from '../dto/chat-message.dto';

const { AUTH_TOKEN_SECRET = '', AUTH_TOKEN_SECRET_REFRESH = '' } = process.env;

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(UserChannel)
    private userChannelRepository: Repository<UserChannel>,
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
    private authService: AuthService,
  ) {}

  fetchUserChannelIds(userId: number) {
    return this.userChannelRepository
      .find({
        where: { userId },
        select: ['channelId'],
      })
      .then((v) => v.map((r) => r.channelId));
  }

  fetchUserContactUserIds(userId: number) {
    return this.contactRepository
      .find({
        where: { userId },
        select: ['contactUserId'],
      })
      .then((v) => v.map((r) => r.contactUserId));
  }

  getCurrentUser(socket: Socket): any {
    const { cookie: socketCookie } = socket.handshake.headers;

    const cookies = cookie.parse(socketCookie!);

    const token = cookies.OCTOPUS_ACCESS_TOKEN;
    const refreshToken = cookies.OCTOPUS_REFRESH_ACCESS_TOKEN;

    if (!token) {
      throw new WsException('You not authorized to use this websocket');
    }

    return verifyJWT(token, AUTH_TOKEN_SECRET).catch(async () => {
      try {
        const refreshPayload = await verifyJWT(
          refreshToken,
          AUTH_TOKEN_SECRET_REFRESH,
        );
        const userPayload = pick(refreshPayload, ['id', 'refreshTokenId']);

        await this.authService.verifyRefreshToken(
          userPayload.refreshTokenId,
          refreshToken,
        );

        return { id: userPayload.id };
      } catch (err) {
        throw new WsException('You not authorized to use this websocket');
      }
    });
  }

  removeChatMessage(identifier: string, userId: number) {
    return this.chatMessageRepository
      .delete({ identifier, createdById: userId })
      .then((v) => !!v.affected);
  }

  saveChatMessage(userId: number, payload: ChatMessageDto, isEdit: boolean) {
    if (isEdit) {
      return this.chatMessageRepository
        .update(
          { identifier: payload.identifier, createdById: userId },
          {
            message: payload.message,
            updatedOn: new Date(),
            edited: true,
          },
        )
        .then((res) => !!res.affected);
    }

    const data: Partial<ChatMessage> = {
      createdById: userId,
      message: payload.message,
      to: payload.to,
      medium: payload.medium,
    };

    if (payload.parent) data.parentIdentifier = payload.parent.identifier;

    return this.chatMessageRepository
      .create(data)
      .save()
      .then((res) => res.id);
  }
}

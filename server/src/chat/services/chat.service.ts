import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from 'entities/Contact.entity';
import { ChatMessageAttachment } from 'entities/ChatMessageAttachment.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { CurrentStreamViewer } from 'entities/CurrentStreamViewer.entity';
import { deleteObject } from 'config/s3-storage';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import cookie from 'cookie';
import { WsException } from '@nestjs/websockets';
import { verifyJWT } from 'helpers/jwt';
import { pick } from 'lodash';
import { AuthService } from 'src/auth/services/auth.service';
import { ChatMessage } from 'entities/ChatMessage.entity';
import { PostService } from 'src/post/services/post.service';
import { ChatMessageDto } from '../dto/chat-message.dto';
import { ChatMessageListQuery } from '../dto/chat-message-list.dto';

const {
  AUTH_TOKEN_SECRET = '',
  AUTH_TOKEN_SECRET_REFRESH = '',
  S3_VIDEO_BUCKET_NAME = '',
  S3_CHAT_MESSAGE_DIR = '',
} = process.env;

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(UserChannel)
    private userChannelRepository: Repository<UserChannel>,
    @InjectRepository(ChatMessageAttachment)
    private chatMessageAttachmentRepo: Repository<ChatMessageAttachment>,
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
    @InjectRepository(CurrentStreamViewer)
    private currentStreamViewerRepository: Repository<CurrentStreamViewer>,
    private authService: AuthService,
    private postService: PostService,
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
      } catch (err: any) {
        throw new WsException('You not authorized to use this websocket');
      }
    });
  }

  removeChatMessage(identifier: string, userId: number) {
    return this.chatMessageRepository
      .delete({ identifier, createdById: userId })
      .then((v) => !!v.affected);
  }

  saveChatMessageAttachment(payload: Partial<ChatMessageAttachment>) {
    return this.chatMessageAttachmentRepo.create(payload).save();
  }

  async removeChatMessageAttachment(name: string, createdById: number) {
    const result = await this.chatMessageAttachmentRepo.delete({
      name,
      createdById,
    });

    if (result.affected) {
      const location = `${S3_CHAT_MESSAGE_DIR}/${name}`;
      await deleteObject({
        Key: location,
        Bucket: S3_VIDEO_BUCKET_NAME,
      });
    }
  }

  async getChatMessages(
    userId: number,
    medium: string,
    id: number,
    query: ChatMessageListQuery,
  ) {
    if (medium === 'post') {
      const post = await this.postService.getOnePost(userId, id, false);
      if (!post)
        throw new ForbiddenException('You are not authorized', 'UNAUTHORIZED');
    } else if (medium === 'channel') {
      const channel = await this.userChannelRepository.findOne({
        where: { userId, channelId: id },
        select: ['id'],
      });

      if (!channel)
        throw new ForbiddenException('You are not authorized', 'UNAUTHORIZED');
    } else {
      const contactUser = await this.contactRepository.findOne({
        userId,
        contactUserId: id,
      });
      if (!contactUser)
        throw new ForbiddenException('You are not authorized', 'UNAUTHORIZED');
    }

    const baseQuery = this.chatMessageRepository
      .createQueryBuilder('chat')
      .select([
        'chat.id',
        'chat.identifier',
        'chat.parentIdentifier',
        'chat.medium',
        'chat.to',
        'chat.message',
        'chat.readOn',
        'chat.isSystemMessage',
        'chat.edited',
        'chat.deleted',
        'chat.createdById',
        'chat.createdOn',
        'parentChat.identifier',
        'parentChat.parentIdentifier',
        'parentChat.medium',
        'parentChat.to',
        'parentChat.message',
        'parentChat.readOn',
        'parentChat.isSystemMessage',
        'parentChat.edited',
        'parentChat.createdOn',
        'parentChat.deleted',
        'parentChat.createdById',
        'createdBy.id',
        'createdBy.userName',
        'createdBy.firstName',
        'createdBy.lastName',
        'createdBy.lastName',
        'createdBy.displayPhoto',
        'parentChatCreatedBy.id',
        'parentChatCreatedBy.userName',
        'parentChatCreatedBy.firstName',
        'parentChatCreatedBy.lastName',
        'parentChatCreatedBy.lastName',
        'parentChatCreatedBy.displayPhoto',
      ])
      .leftJoin('chat.createdBy', 'createdBy')
      .leftJoin('chat.parent', 'parentChat')
      .leftJoinAndSelect('chat.attachments', 'attachments')
      .leftJoin('parentChat.createdBy', 'parentChatCreatedBy')
      .orderBy('chat.id', 'DESC')
      .where('chat.medium = :medium', { medium })
      .andWhere('chat.to = :to', { to: id });

    if (query.lastDate)
      baseQuery.andWhere('chat.createdOn < :lastDate', {
        lastDate: query.lastDate,
      });

    return baseQuery.paginate({ limit: query.limit, skip: 0 });
  }

  async saveChatMessage(
    userId: number,
    payload: ChatMessageDto,
    isEdit: boolean,
  ) {
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
      identifier: payload.identifier,
      createdById: userId,
      message: payload.message,
      to: payload.to,
      medium: payload.medium,
    };

    if (payload.parent) data.parentIdentifier = payload.parent.identifier;

    const chatMessageId = await this.chatMessageRepository
      .create(data)
      .save()
      .then((res) => res.id);

    if (payload.attachments?.length) {
      for (const attachment of payload.attachments) {
        await this.chatMessageAttachmentRepo
          .create({ name: attachment.name, chatMessageId })
          .save();
      }
    }

    return chatMessageId;
  }

  async addCurrentStreamViewer(userId: number, postId: number) {
    return this.currentStreamViewerRepository
      .create({
        postId,
        userId,
      })
      .save()
      .catch(() => {
        // if it fails validation contraints just ignore it
        return null;
      });
  }

  async removeCurrentStreamViewer(userId: number, postId: number) {
    return this.currentStreamViewerRepository.delete({
      postId,
      userId,
    });
  }

  async getTotalNumberOfStreamViewers(postId: number) {
    return this.currentStreamViewerRepository.count({ postId });
  }
}

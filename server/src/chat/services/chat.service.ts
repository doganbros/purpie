import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from 'entities/Contact.entity';
import { ChatMessageAttachment } from 'entities/ChatMessageAttachment.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { CurrentStreamViewer } from 'entities/CurrentStreamViewer.entity';
import { deleteObject } from 'config/s3-storage';
import { PaginationQuery } from 'types/PaginationQuery';
import { Socket } from 'socket.io';
import { Brackets, Repository } from 'typeorm';
import cookie from 'cookie';
import { WsException } from '@nestjs/websockets';
import { getJWTCookieKeys, verifyJWT } from 'helpers/jwt';
import { pick } from 'lodash';
import { AuthService } from 'src/auth/services/auth.service';
import { ChatMessage } from 'entities/ChatMessage.entity';
import { PostService } from 'src/post/services/post.service';
import { ChatMessageDto } from '../dto/chat-message.dto';
import { ChatMessageListQuery } from '../dto/chat-message-list.dto';
import { ErrorTypes } from '../../../types/ErrorTypes';

const {
  AUTH_TOKEN_SECRET = '',
  AUTH_TOKEN_SECRET_REFRESH = '',
  S3_BUCKET_NAME = '',
  S3_CHAT_ATTACHMENTS_DIR = '',
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

  fetchUserContactUserIds(userId: string) {
    return this.contactRepository
      .find({
        where: { userId },
        select: ['contactUserId'],
      })
      .then((v) => v.map((r) => r.contactUserId));
  }

  getCurrentUser(socket: Socket): any {
    const { cookie: socketCookie } = socket.handshake.headers;

    if (!socketCookie) return null;

    const cookies = cookie.parse(socketCookie!);

    const { accessTokenKey, refreshAccessTokenKey } = getJWTCookieKeys();
    const token = cookies[accessTokenKey];
    const refreshToken = cookies[refreshAccessTokenKey];

    if (!token) {
      throw new WsException(ErrorTypes.NOT_AUTHORIZED);
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
        throw new WsException(ErrorTypes.NOT_AUTHORIZED);
      }
    });
  }

  removeChatMessage(identifier: string, userId: string) {
    return this.chatMessageRepository
      .delete({ identifier, createdById: userId })
      .then((v) => !!v.affected);
  }

  saveChatMessageAttachment(payload: Partial<ChatMessageAttachment>) {
    return this.chatMessageAttachmentRepo.create(payload).save();
  }

  async removeChatMessageAttachment(name: string, createdById: string) {
    const result = await this.chatMessageAttachmentRepo.delete({
      name,
      createdById,
    });

    if (result.affected) {
      const location = `${S3_CHAT_ATTACHMENTS_DIR}/${name}`;
      await deleteObject({
        Key: location,
        Bucket: S3_BUCKET_NAME,
      });
    }
  }

  async getChatMessages(
    userId: string,
    medium: string,
    id: string,
    query: ChatMessageListQuery,
  ) {
    if (medium === 'post') {
      const post = await this.postService.getOnePost(userId, id, null, false);
      if (!post)
        throw new ForbiddenException(
          ErrorTypes.NOT_AUTHORIZED,
          'You are not authorized',
        );
    } else if (medium === 'channel') {
      const channel = await this.userChannelRepository.findOne({
        where: { userId, channelId: id },
        select: ['id'],
      });

      if (!channel)
        throw new ForbiddenException(
          ErrorTypes.NOT_AUTHORIZED,
          'You are not authorized',
        );
    } else {
      const contactUser = await this.contactRepository.findOne({
        userId,
        contactUserId: id,
      });
      if (!contactUser)
        throw new ForbiddenException(
          ErrorTypes.NOT_AUTHORIZED,
          'You are not authorized',
        );
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
        'createdBy.fullName',
        'createdBy.displayPhoto',
        'parentChatCreatedBy.id',
        'parentChatCreatedBy.userName',
        'parentChatCreatedBy.fullName',
        'parentChatCreatedBy.displayPhoto',
      ])
      .leftJoin('chat.createdBy', 'createdBy')
      .leftJoin('chat.parent', 'parentChat')
      .leftJoinAndSelect('chat.attachments', 'attachments')
      .leftJoin('parentChat.createdBy', 'parentChatCreatedBy')
      .orderBy('chat.createdOn', 'DESC')
      .where(
        new Brackets((qb) => {
          qb.where("chat.medium = 'post'").andWhere('chat.to = :to', {
            to: id,
          });
        }),
      )
      .orWhere(
        new Brackets((qb) => {
          qb.where("chat.medium = 'direct'").andWhere(
            new Brackets((qbb) => {
              qbb.where(
                '(chat.to = :userId and chat.createdById = :id) or (chat.to = :id and chat.createdById = :userId)',
                {
                  userId,
                  id,
                },
              );
            }),
          );
        }),
      );

    if (query.lastDate)
      baseQuery.andWhere('chat.createdOn < :lastDate', {
        lastDate: query.lastDate,
      });

    return baseQuery.paginate({ limit: query.limit, skip: 0 });
  }

  async getUnreadMessageCounts(to: string, createdById: string) {
    return this.chatMessageRepository.count({
      where: { to, createdById, readOn: null },
    });
  }

  async saveChatMessage(
    userId: string,
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
          .create({
            name: attachment.name,
            originalFileName: attachment.originalFileName,
            chatMessageId,
            createdById: payload.createdBy.id,
          })
          .save();
      }
    }

    return chatMessageId;
  }

  async addCurrentStreamViewer(userId: string, postId: string) {
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

  async removeCurrentStreamViewer(userId: string, postId: string) {
    return this.currentStreamViewerRepository.delete({
      postId,
      userId,
    });
  }

  async getTotalNumberOfStreamViewers(postId: string) {
    return this.currentStreamViewerRepository.count({ postId });
  }

  async updateMessageReadOn(createdById: string, to: string, readOn: Date) {
    const unreadMessages = await this.chatMessageRepository.find({
      where: {
        to,
        createdById,
        readOn: null,
      },
    });

    for (const message of unreadMessages) {
      await this.chatMessageRepository.update({ id: message.id }, { readOn });
    }
  }

  async getChatAttachments(
    userId: string,
    id: number,
    medium: 'direct' | 'channel' | 'post',
    query: PaginationQuery,
  ) {
    // post might not be supported in the future because it requires more logic to determine if
    // the user is authorized or not
    // for now we support it for demonstration purpose

    return this.chatMessageAttachmentRepo
      .createQueryBuilder('chat_msg_attachment')
      .innerJoin('chat_msg_attachment.chatMessage', 'chatMessage')
      .where('chatMessage.medium = :medium', { medium })
      .andWhere('chatMessage.to = :to', { to: id })
      .andWhere(
        new Brackets((qb) => {
          qb.where('chatMessage.createdBy = :userId', {
            userId,
          })
            .orWhere(
              'chatMessage.medium = :directMedium and chatMessage.to = :userId',
              { directMedium: 'direct', userId },
            )
            .orWhere(
              'chatMessage.medium = :channelMedium and exists (select id from user_channel where "channelId" = :channelId and "userId" = :userId)',
              { channelId: id, channelMedium: 'channel', userId },
            );
        }),
      )
      .paginate(query);
  }

  getRoomName(id: string, medium: 'direct' | 'channel' | 'post' = 'direct') {
    return `${medium}_${id}`;
  }
}

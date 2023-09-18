import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ChatMessageAttachment } from 'entities/ChatMessageAttachment.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import {
  ApiBody,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationQuery } from 'types/PaginationQuery';
import { s3, s3HeadObject, s3Storage } from 'config/s3-storage';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserTokenPayload } from 'src/auth/interfaces/user.interface';
import { ChatMessageListQuery } from '../dto/chat-message-list.dto';
import { ChatService } from '../services/chat.service';
import { errorResponseDoc } from '../../../helpers/error-response-doc';
import { ErrorTypes } from '../../../types/ErrorTypes';
import { ChatListResponse } from '../response/chat-list.response';
import { ChatCountResponse } from '../response/chat-count.response';

const { S3_BUCKET_NAME = '', S3_CHAT_ATTACHMENTS_DIR = '' } = process.env;

@ApiTags('Chat')
@Controller({ version: '1', path: 'chat' })
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('list/messages/:medium/:id')
  @ApiParam({
    name: 'medium',
    description: 'medium of the messages',
    enum: ['direct', 'channel', 'post'],
  })
  @ApiForbiddenResponse({
    description:
      'Error thrown when given medium source not found with given credentials.',
    schema: errorResponseDoc(
      403,
      'You are not authorized',
      ErrorTypes.NOT_AUTHORIZED,
    ),
  })
  @ApiOkResponse({
    description: 'List chat messages with given params',
    type: ChatListResponse,
  })
  @IsAuthenticated()
  listChatMessages(
    @Param('medium') medium: string,
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: UserTokenPayload,
    @Query() query: ChatMessageListQuery,
  ) {
    return this.chatService.getChatMessages(user.id, medium, id, query);
  }

  @Get('message/unread/counts')
  @ApiOkResponse({
    description: 'Get unread message count with each contact user',
    type: ChatCountResponse,
    isArray: true,
  })
  @IsAuthenticated()
  async countUnreadMessages(@CurrentUser() user: UserTokenPayload) {
    const result = [];
    const contactIds = await this.chatService.fetchUserContactUserIds(user.id);
    for (const contactId of contactIds) {
      const count = await this.chatService.getUnreadMessageCounts(
        user.id,
        contactId,
      );
      result.push({ userId: contactId, count });
    }

    return result;
  }

  @Get('list/attachments/:medium/:id')
  @IsAuthenticated()
  listChatAttachments(
    @Param('medium') medium: 'channel' | 'post' | 'direct',
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserTokenPayload,
    @Query() query: PaginationQuery,
  ) {
    return this.chatService.getChatAttachments(user.id, id, medium, query);
  }

  @Get('attachment/:name')
  @IsAuthenticated()
  async getChatAttachment(@Param('name') name: string, @Res() res: Response) {
    const creds = {
      Bucket: S3_BUCKET_NAME,
      Key: `${S3_CHAT_ATTACHMENTS_DIR}${name}`,
    };

    try {
      const head = await s3HeadObject(creds);
      const objectStream = s3.getObject(creds).createReadStream();

      if (head.ContentType) res.setHeader('Content-Type', head.ContentType);

      return objectStream.pipe(res);
    } catch (err: any) {
      return res.status(err.statusCode || 500).json(err);
    }
  }

  @Post('attachment')
  @IsAuthenticated()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: s3Storage(S3_CHAT_ATTACHMENTS_DIR),
      limits: {
        fileSize: 5e7, // 50MB,
      },
    }),
  )
  addChatAttachment(@UploadedFile() file: Express.MulterS3.File) {
    const payload: Partial<ChatMessageAttachment> = {
      name: file.key.replace(S3_CHAT_ATTACHMENTS_DIR, ''),
      originalFileName: file.originalname,
    };

    return payload;
  }

  @Delete('attachment/:name')
  @IsAuthenticated()
  @ApiOkResponse({ description: 'Delete specified chat attachment' })
  async removeChatAttachment(
    @Param('name') name: string,
    @CurrentUser() user: UserTokenPayload,
  ) {
    await this.chatService.removeChatMessageAttachment(name, user.id);
  }
}

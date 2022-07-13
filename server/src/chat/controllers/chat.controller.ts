import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ChatMessageAttachment } from 'entities/ChatMessageAttachment.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { PaginationQuery } from 'types/PaginationQuery';
import { s3, s3HeadObject, s3Storage } from 'config/s3-storage';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserTokenPayload } from 'src/auth/interfaces/user.interface';
import { ChatMessageListQuery } from '../dto/chat-message-list.dto';
import { ChatService } from '../services/chat.service';

const { S3_VIDEO_BUCKET_NAME = '', S3_CHAT_MESSAGE_DIR = '' } = process.env;

@ApiTags('chat')
@Controller({ version: '1', path: 'chat' })
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('list/messages/:medium/:id')
  @IsAuthenticated()
  listChatMessages(
    @Param('medium') medium: string,
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserTokenPayload,
    @Query() query: ChatMessageListQuery,
  ) {
    return this.chatService.getChatMessages(user.id, medium, id, query);
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
      Bucket: S3_VIDEO_BUCKET_NAME,
      Key: `${S3_CHAT_MESSAGE_DIR}${name}`,
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
      storage: s3Storage(S3_CHAT_MESSAGE_DIR),
      limits: {
        fileSize: 5e7, // 50MB,
      },
    }),
  )
  addChatAttachment(@UploadedFile() file: Express.MulterS3.File) {
    const payload: Partial<ChatMessageAttachment> = {
      name: file.key.replace(S3_CHAT_MESSAGE_DIR, ''),
      originalFileName: file.originalname,
    };

    return payload;
  }

  @Delete('attachment/:name')
  @IsAuthenticated()
  async removeChatAttachment(
    @Param('name') name: string,
    @CurrentUser() user: UserTokenPayload,
  ) {
    await this.chatService.removeChatMessageAttachment(name, user.id);
    return 'OK';
  }
}

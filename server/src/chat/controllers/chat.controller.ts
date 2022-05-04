import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserTokenPayload } from 'src/auth/interfaces/user.interface';
import { ChatMessageListQuery } from '../dto/chat-message-list.dto';
import { ChatService } from '../services/chat.service';

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
}

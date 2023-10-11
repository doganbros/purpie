import { UserChannel } from 'entities/UserChannel.entity';
import { Module } from '@nestjs/common';
import { PostModule } from 'src/post/post.module';
import { ChatMessage } from 'entities/ChatMessage.entity';
import { CurrentStreamViewer } from 'entities/CurrentStreamViewer.entity';
import { ChatMessageAttachment } from 'entities/ChatMessageAttachment.entity';
import { Contact } from 'entities/Contact.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './services/chat.service';
import { ChatGateway } from './gateways/chat.gateway';
import { ChatController } from './controllers/chat.controller';
import { UserLogModule } from '../log/user-log.module';
import { MeetingModule } from '../meeting/meeting.module';

@Module({
  providers: [ChatGateway, ChatService],
  imports: [
    AuthModule,
    PostModule,
    UserLogModule,
    MeetingModule,
    TypeOrmModule.forFeature([
      UserChannel,
      Contact,
      ChatMessage,
      ChatMessageAttachment,
      CurrentStreamViewer,
    ]),
  ],

  controllers: [ChatController],
})
export class ChatModule {}

import { UserChannel } from 'entities/UserChannel.entity';
import { Module } from '@nestjs/common';
import { PostModule } from 'src/post/post.module';
import { ChatMessage } from 'entities/ChatMessage.entity';
import { Contact } from 'entities/Contact.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './services/chat.service';
import { ChatGateway } from './gateways/chat.gateway';

@Module({
  providers: [ChatGateway, ChatService],
  imports: [
    AuthModule,
    PostModule,
    TypeOrmModule.forFeature([UserChannel, Contact, ChatMessage]),
  ],
})
export class ChatModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'entities/Post.entity';
import { MeetingLog } from 'entities/MeetingLog.entity';
import { PostVideo } from 'entities/PostVideo.entity';
import { User } from 'entities/User.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { PostTag } from 'entities/PostTag.entity';
import { ChannelModule } from 'src/channel/channel.module';
import { MailModule } from 'src/mail/mail.module';
import { ZoneModule } from 'src/zone/zone.module';
import { MeetingController } from './controllers/meeting.controller';
import { MeetingService } from './services/meeting.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
      User,
      UserChannel,
      MeetingLog,
      PostTag,
      PostVideo,
    ]),
    ZoneModule,
    MailModule,
    ChannelModule,
  ],
  controllers: [MeetingController],
  providers: [MeetingService],
})
export class MeetingModule {}

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
import { MeetingGateway } from './gateways/meeting.gateway';
import { Call } from "../../entities/Call.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
      User,
      UserChannel,
      MeetingLog,
      PostTag,
      PostVideo,
      Call
    ]),
    ZoneModule,
    MailModule,
    ChannelModule,
  ],
  exports: [MeetingService],
  controllers: [MeetingController],
  providers: [MeetingService, MeetingGateway],
})
export class MeetingModule {}

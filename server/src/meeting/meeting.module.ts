import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meeting } from 'entities/Meeting.entity';
import { MeetingAttendance } from 'entities/MeetingAttendance.entity';
import { User } from 'entities/User.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { ChannelModule } from 'src/channel/channel.module';
import { MailModule } from 'src/mail/mail.module';
import { ZoneModule } from 'src/zone/zone.module';
import { MeetingController } from './meeting.controller';
import { MeetingService } from './meeting.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Meeting, User, UserChannel, MeetingAttendance]),
    ZoneModule,
    MailModule,
    ChannelModule,
  ],
  controllers: [MeetingController],
  providers: [MeetingService],
})
export class MeetingModule {}

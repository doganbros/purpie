import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meeting } from 'entities/Meeting.entity';
import { User } from 'entities/User.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { UserZone } from 'entities/UserZone.entity';
import { ChannelModule } from 'src/channel/channel.module';
import { ZoneModule } from 'src/zone/zone.module';
import { MeetingController } from './meeting.controller';
import { MeetingService } from './meeting.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Meeting, User, UserZone, UserChannel]),
    ZoneModule,
    ChannelModule,
  ],
  controllers: [MeetingController],
  providers: [MeetingService],
})
export class MeetingModule {}

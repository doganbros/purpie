import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'entities/Post.entity';
import { MeetingRecording } from 'entities/MeetingRecording.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { ChannelModule } from 'src/channel/channel.module';
import { MailModule } from 'src/mail/mail.module';
import { ZoneModule } from 'src/zone/zone.module';
import { StaticVideoController } from './static-video.controller';
import { StaticVideoService } from './static-video.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserChannel, Post, MeetingRecording]),
    MailModule,
    ZoneModule,
    ChannelModule,
  ],
  controllers: [StaticVideoController],
  providers: [StaticVideoService],
})
export class StaticVideoModule {}

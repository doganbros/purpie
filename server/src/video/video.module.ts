import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'entities/Post.entity';
import { PostTag } from 'entities/PostTag.entity';
import { PostVideo } from 'entities/PostVideo.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { ChannelModule } from 'src/channel/channel.module';
import { MailModule } from 'src/mail/mail.module';
import { ZoneModule } from 'src/zone/zone.module';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserChannel, Post, PostVideo, PostTag]),
    MailModule,
    ZoneModule,
    ChannelModule,
  ],
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule {}

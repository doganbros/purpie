import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserChannel } from 'entities/UserChannel.entity';
import { VideoPost } from 'entities/VideoPost.entity';
import { ChannelModule } from 'src/channel/channel.module';
import { MailModule } from 'src/mail/mail.module';
import { ZoneModule } from 'src/zone/zone.module';
import { VideoPostController } from './video-post.controller';
import { VideoPostService } from './video-post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([VideoPost, UserChannel]),
    MailModule,
    ZoneModule,
    ChannelModule,
  ],
  controllers: [VideoPostController],
  providers: [VideoPostService],
})
export class VideoPostModule {}

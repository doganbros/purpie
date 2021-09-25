import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from 'entities/Channel.entity';
import { Post } from 'entities/Post.entity';
import { User } from 'entities/User.entity';
import { Zone } from 'entities/Zone.entity';
import { ChannelModule } from 'src/channel/channel.module';
import { ZoneModule } from 'src/zone/zone.module';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, Zone, User, Post]),
    ZoneModule,
    ChannelModule,
  ],
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActivityModule {}

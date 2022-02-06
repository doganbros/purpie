import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from 'entities/Channel.entity';
import { User } from 'entities/User.entity';
import { Zone } from 'entities/Zone.entity';
import { ChannelModule } from 'src/channel/channel.module';
import { ZoneModule } from 'src/zone/zone.module';
import { ActivityController } from './controllers/activity.controller';
import { ActivityService } from './services/activity.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, Zone, User]),
    ZoneModule,
    ChannelModule,
  ],
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActivityModule {}

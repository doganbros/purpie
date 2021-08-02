import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';

import { UserChannelRepository } from 'entities/repositories/UserChannel.repository';
import { ZoneModule } from 'src/zone/zone.module';
import { Invitation } from 'entities/Invitation.entity';
import { Channel } from 'entities/Channel.entity';
import { ChannelController } from './controllers/channel.controller';
import { UserChannelController } from './controllers/user-channel.controller';
import { ChannelService } from './channel.service';

@Module({
  controllers: [ChannelController, UserChannelController],
  imports: [
    TypeOrmModule.forFeature([UserChannelRepository, Channel, Invitation]),
    MailModule,
    forwardRef(() => ZoneModule),
  ],
  exports: [ChannelService],
  providers: [ChannelService],
})
export class ChannelModule {}

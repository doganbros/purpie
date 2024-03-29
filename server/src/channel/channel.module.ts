import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { ChannelRole } from 'entities/ChannelRole.entity';
import { ZoneModule } from 'src/zone/zone.module';
import { UserChannel } from 'entities/UserChannel.entity';
import { Invitation } from 'entities/Invitation.entity';
import { Channel } from 'entities/Channel.entity';
import { ChannelController } from './controllers/channel.controller';
import { UserChannelController } from './controllers/user-channel.controller';
import { ChannelService } from './services/channel.service';
import { UserChannelService } from './services/user-channel.service';
import { UserLog } from '../../entities/UserLog.entity';

@Module({
  controllers: [ChannelController, UserChannelController],
  imports: [
    TypeOrmModule.forFeature([
      UserChannel,
      Channel,
      Invitation,
      ChannelRole,
      UserLog,
    ]),
    MailModule,
    forwardRef(() => ZoneModule),
  ],
  exports: [UserChannelService],
  providers: [ChannelService, UserChannelService],
})
export class ChannelModule {}

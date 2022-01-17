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
import { ChannelService } from './channel.service';

@Module({
  controllers: [ChannelController, UserChannelController],
  imports: [
    TypeOrmModule.forFeature([UserChannel, Channel, Invitation, ChannelRole]),
    MailModule,
    forwardRef(() => ZoneModule),
  ],
  exports: [ChannelService],
  providers: [ChannelService],
})
export class ChannelModule {}

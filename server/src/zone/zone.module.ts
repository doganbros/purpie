import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from 'entities/Channel.entity';
import { UserZoneRepository } from 'entities/repositories/UserZone.repository';
import { Invitation } from 'entities/Invitation.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { Zone } from 'entities/Zone.entity';
import { MailModule } from 'src/mail/mail.module';
import { ChannelModule } from 'src/channel/channel.module';
import { UserZoneController } from './controllers/user-zone.controller';
import { ZoneService } from './zone.service';
import { ZoneController } from './controllers/zone.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Zone,
      Channel,
      UserChannel,
      Invitation,
      UserZoneRepository,
    ]),
    MailModule,
    forwardRef(() => ChannelModule),
  ],
  controllers: [UserZoneController, ZoneController],
  providers: [ZoneService],
  exports: [ZoneService],
})
export class ZoneModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from 'entities/Channel.entity';
import { UserZoneRepository } from 'entities/repositories/UserZone.repository';
import { Invitation } from 'entities/Invitation.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { UserZone } from 'entities/UserZone.entity';
import { Zone } from 'entities/Zone.entity';
import { MailModule } from 'src/mail/mail.module';
import { UserZoneController } from './controllers/user-zone.controller';
import { ZoneService } from './zone.service';
import { ZoneController } from './controllers/zone.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Zone,
      UserZone,
      Channel,
      UserChannel,
      Invitation,
      UserZoneRepository,
    ]),
    MailModule,
  ],
  controllers: [UserZoneController, ZoneController],
  providers: [ZoneService],
})
export class ZoneModule {}

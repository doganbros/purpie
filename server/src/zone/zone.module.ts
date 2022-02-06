import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserZoneRepository } from 'entities/repositories/UserZone.repository';
import { Invitation } from 'entities/Invitation.entity';
import { Zone } from 'entities/Zone.entity';
import { ZoneRole } from 'entities/ZoneRole.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { Category } from 'entities/Category.entity';
import { MailModule } from 'src/mail/mail.module';
import { UserZoneController } from './controllers/user-zone.controller';
import { ZoneService } from './services/zone.service';
import { ZoneController } from './controllers/zone.controller';
import { UserZoneService } from './services/user-zone.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Zone,
      Invitation,
      Category,
      ZoneRole,
      UserZoneRepository,
      UserChannel,
    ]),
    MailModule,
  ],
  controllers: [UserZoneController, ZoneController],
  providers: [ZoneService, UserZoneService],
  exports: [UserZoneService],
})
export class ZoneModule {}

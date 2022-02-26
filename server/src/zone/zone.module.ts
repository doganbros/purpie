import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invitation } from 'entities/Invitation.entity';
import { Zone } from 'entities/Zone.entity';
import { ZoneRole } from 'entities/ZoneRole.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { Category } from 'entities/Category.entity';
import { UserZone } from 'entities/UserZone.entity';
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
      UserZone,
      UserChannel,
    ]),
    MailModule,
  ],
  controllers: [UserZoneController, ZoneController],
  providers: [ZoneService, UserZoneService],
  exports: [UserZoneService],
})
export class ZoneModule {}

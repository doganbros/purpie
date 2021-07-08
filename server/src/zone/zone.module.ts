import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserZoneRepository } from 'entities/repositories/UserZone.repository';
import { UserZone } from 'entities/UserZone.entity';
import { UserZonePermission } from 'entities/UserZonePermission.entity';
import { Zone } from 'entities/Zone.entity';
import { MailModule } from 'src/mail/mail.module';
import { UserZoneController } from './user-zone.controller';
import { ZoneService } from './zone.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Zone,
      UserZone,
      UserZonePermission,
      UserZoneRepository,
    ]),
    MailModule,
  ],
  controllers: [UserZoneController],
  providers: [ZoneService],
})
export class ZoneModule {}

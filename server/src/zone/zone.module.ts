import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserZoneRepository } from 'entities/repositories/UserZone.repository';
import { Invitation } from 'entities/Invitation.entity';
import { Zone } from 'entities/Zone.entity';
import { Category } from 'entities/Category.entity';
import { MailModule } from 'src/mail/mail.module';
import { UserZoneController } from './controllers/user-zone.controller';
import { ZoneService } from './zone.service';
import { ZoneController } from './controllers/zone.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Zone, Invitation, Category, UserZoneRepository]),
    MailModule,
  ],
  controllers: [UserZoneController, ZoneController],
  providers: [ZoneService],
  exports: [ZoneService],
})
export class ZoneModule {}

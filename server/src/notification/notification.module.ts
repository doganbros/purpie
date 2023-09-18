import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'entities/Notification.entity';
import { NotificationController } from './controllers/notification.controller';
import { NotificationService } from './services/notification.service';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
  imports: [TypeOrmModule.forFeature([Notification])],
})
export class NotificationModule {}

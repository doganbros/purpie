import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'entities/Notification.entity';
import { User } from 'entities/User.entity';
import { UserTokenPayload } from 'src/auth/interfaces/user.interface';
import { Repository } from 'typeorm';
import { UserEvent } from './user.event';

@Injectable()
export class UserListener {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  @OnEvent(UserEvent.sendContactRequestNotification)
  async handleContactRequestSent({
    email,
    user,
  }: {
    email: string;
    user: UserTokenPayload;
  }) {
    const emailUser = await this.userRepository.findOne({ email });

    if (!emailUser) return;

    await this.notificationRepository
      .create({
        type: 'contact_request_received',
        userId: emailUser.id,
        createdById: user.id,
      })
      .save();
  }

  async handleContactRequestAccepted({
    createdById,
    userId,
  }: {
    createdById: string;
    userId: string;
  }) {
    await this.notificationRepository
      .create({
        type: 'contact_request_accepted',
        userId: createdById,
        createdById: userId,
      })
      .save();
  }
}

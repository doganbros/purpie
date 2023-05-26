import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from 'entities/Contact.entity';
import { Notification } from 'entities/Notification.entity';
import { Invitation } from 'entities/Invitation.entity';
import { User } from 'entities/User.entity';
import { FeaturedPost } from 'entities/FeaturedPost.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { UserZone } from 'entities/UserZone.entity';
import { UserRole } from 'entities/UserRole.entity';
import { AuthModule } from 'src/auth/auth.module';
import { BlockedUser } from '../../entities/BlockedUser.entity';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserListener } from './listeners/user.listener';
import { MailService } from '../mail/mail.service';

@Module({
  controllers: [UserController],
  imports: [
    TypeOrmModule.forFeature([
      Contact,
      User,
      UserRole,
      UserZone,
      UserChannel,
      Notification,
      FeaturedPost,
      Invitation,
      BlockedUser,
    ]),
    AuthModule,
  ],
  providers: [UserService, UserListener, MailService],
  exports: [UserService],
})
export class UserModule {}

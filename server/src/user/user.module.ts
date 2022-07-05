import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from 'entities/Contact.entity';
import { Notification } from 'entities/Notification.entity';
import { Invitation } from 'entities/Invitation.entity';
import { User } from 'entities/User.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { UserRole } from 'entities/UserRole.entity';
import { AuthModule } from 'src/auth/auth.module';
import { BlockedUser } from '../../entities/BlockedUser.entity';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserListener } from './listeners/user.listener';

@Module({
  controllers: [UserController],
  imports: [
    TypeOrmModule.forFeature([
      Contact,
      User,
      UserRole,
      UserChannel,
      Notification,
      Invitation,
      BlockedUser,
    ]),
    AuthModule,
  ],
  providers: [UserService, UserListener],
})
export class UserModule {}

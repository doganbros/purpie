import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from 'entities/Contact.entity';
import { ContactInvitation } from 'entities/ContactInvitation.entity';
import { User } from 'entities/User.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { UserRole } from 'entities/UserRole.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

@Module({
  controllers: [UserController],
  imports: [
    TypeOrmModule.forFeature([
      Contact,
      ContactInvitation,
      User,
      UserRole,
      UserChannel,
    ]),
    AuthModule,
  ],
  providers: [UserService],
})
export class UserModule {}

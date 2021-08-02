import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'entities/User.entity';
import { UserZone } from 'entities/UserZone.entity';
import { MailModule } from 'src/mail/mail.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './auth.service';
import { AuthThirdPartyController } from './controllers/auth-third-party.controller';

@Module({
  controllers: [AuthController, AuthThirdPartyController],
  imports: [TypeOrmModule.forFeature([User, UserZone]), MailModule],
  providers: [AuthService],
})
export class AuthModule {}

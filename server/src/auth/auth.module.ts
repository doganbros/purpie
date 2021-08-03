import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'entities/User.entity';
import { MailModule } from 'src/mail/mail.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './auth.service';
import { AuthThirdPartyController } from './controllers/auth-third-party.controller';

@Global()
@Module({
  controllers: [AuthController, AuthThirdPartyController],
  imports: [TypeOrmModule.forFeature([User]), MailModule],
  exports: [AuthService],
  providers: [AuthService],
})
export class AuthModule {}

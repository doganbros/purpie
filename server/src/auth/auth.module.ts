import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'entities/User.entity';
import { Client } from 'entities/Client.entity';
import { MailModule } from 'src/mail/mail.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './auth.service';
import { AuthThirdPartyController } from './controllers/auth-third-party.controller';
import { ClientAuthController } from './controllers/client-auth.controller';

@Global()
@Module({
  controllers: [AuthController, AuthThirdPartyController, ClientAuthController],
  imports: [TypeOrmModule.forFeature([User, Client]), MailModule],
  exports: [AuthService],
  providers: [AuthService],
})
export class AuthModule {}

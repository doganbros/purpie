import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactRepository } from 'entities/repositories/Contact.repository';
import { UserController } from './controllers/user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([ContactRepository])],
  providers: [UserService],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from 'entities/Contact.entity';
import { ContactInvitation } from 'entities/ContactInvitation.entity';
import { UserController } from './controllers/user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([Contact, ContactInvitation])],
  providers: [UserService],
})
export class UserModule {}

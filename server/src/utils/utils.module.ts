import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'entities/Client.entity';
import { User } from 'entities/User.entity';
import { UtilService } from './services/util.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Client])],
  providers: [UtilService],
})
export class UtilsModule {}

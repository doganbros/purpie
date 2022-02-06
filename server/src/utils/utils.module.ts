import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'entities/Client.entity';
import { User } from 'entities/User.entity';
import { MattermostService } from './services/mattermost.service';
import { UtilService } from './services/util.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Client])],
  providers: [MattermostService, UtilService],
  exports: [MattermostService],
})
export class UtilsModule {}

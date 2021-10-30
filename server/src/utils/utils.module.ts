import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'entities/User.entity';
import { MattermostService } from './mattermost.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [MattermostService],
  exports: [MattermostService],
})
export class UtilsModule {}

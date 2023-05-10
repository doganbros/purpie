import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLog } from '../../entities/UserLog.entity';
import { UserLogService } from './services/user-log.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserLog])],
  providers: [UserLogService],
  exports: [UserLogService],
})
export class UserLogModule {}

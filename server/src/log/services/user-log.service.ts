import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLog } from '../../../entities/UserLog.entity';
import { CreateLogDto } from '../dto/create-log.dto';

@Injectable()
export class UserLogService {
  constructor(
    @InjectRepository(UserLog)
    private userLogRepository: Repository<UserLog>,
  ) {}

  async createLog(log: CreateLogDto) {
    const newLog = await this.userLogRepository.create(log);
    await this.userLogRepository.save(newLog);
    return newLog;
  }
}

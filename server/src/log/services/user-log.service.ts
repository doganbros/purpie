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

  async upsertUserOnlineDate(userId: string) {
    const existedLog = await this.userLogRepository.findOne({
      where: { action: 'lastOnlineDate', createdById: userId },
    });
    if (existedLog) {
      const payload = { ...JSON.parse(existedLog.payload) };
      payload.onlineCount++;
      await this.userLogRepository.update(
        { id: existedLog.id },
        { payload, updatedOn: new Date() },
      );
    } else {
      await this.createLog({
        action: 'lastOnlineDate',
        payload: JSON.stringify({ onlineCount: 1 }),
        createdById: userId,
        updatedOn: new Date(),
      });
    }
  }

  async getUserLastOnlineDate(userId: string) {
    return this.userLogRepository
      .createQueryBuilder('log')
      .select('max(log.createdOn)')
      .where('log.createdById = :userId', { userId })
      .getOne();
  }

  async listChannelLogs(userId: string, channelId: string) {
    return this.userLogRepository
      .createQueryBuilder('log')
      .where('log.channelId = :channelId', {
        channelId,
      })
      .andWhere('log.createdById = :userId', { userId })
      .orderBy('log.createdOn', 'DESC');
  }
}

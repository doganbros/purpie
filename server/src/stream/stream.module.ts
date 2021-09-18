import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meeting } from 'entities/Meeting.entity';
import { StreamLog } from 'entities/StreamLog.entity';
import { StreamController } from './stream.controller';
import { StreamService } from './stream.service';

@Module({
  imports: [TypeOrmModule.forFeature([StreamLog, Meeting])],
  controllers: [StreamController],
  providers: [StreamService],
})
export class StreamModule {}

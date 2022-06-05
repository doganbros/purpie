import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'entities/Post.entity';
import { StreamLog } from 'entities/StreamLog.entity';
import { User } from 'entities/User.entity';
import { StreamController } from './controllers/stream.controller';
import { StreamService } from './stream.service';

@Module({
  imports: [TypeOrmModule.forFeature([StreamLog, Post, User])],
  controllers: [StreamController],
  providers: [StreamService],
})
export class StreamModule {}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentStreamViewer } from 'entities/CurrentStreamViewer.entity';
import { Post } from 'entities/Post.entity';
import { StreamLog } from 'entities/StreamLog.entity';
import { User } from 'entities/User.entity';
import { Repository } from 'typeorm';
import { PaginationQuery } from 'types/PaginationQuery';
import { ClientStreamEventDto } from './dto/client-stream-event.dto';

@Injectable()
export class StreamService {
  constructor(
    @InjectRepository(StreamLog)
    private streamLogRepo: Repository<StreamLog>,
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(CurrentStreamViewer)
    private readonly currentStreamViewerRepo: Repository<CurrentStreamViewer>,
  ) {}

  async setStreamEvent(info: ClientStreamEventDto) {
    const streamLog = this.streamLogRepo.create({
      event: info.event,
      slug: info.slug,
      mediaType: info.mediaType || 'video',
    });

    await streamLog.save();

    if (
      ['publish_started', 'publish_done'].includes(info.event) &&
      (!info.postType || info.postType === 'meeting')
    ) {
      await this.postRepo.update(
        {
          slug: info.slug,
        },
        { streaming: info.event === 'publish_started' },
      );
    }

    return streamLog;
  }

  async getStreamLogs(slug: string, query: PaginationQuery) {
    return this.streamLogRepo
      .createQueryBuilder('stream_log')
      .select([
        'stream_log.id',
        'stream_log.createdOn',
        'stream_log.extraInfo',
        'stream_log.event',
        'stream_log.mediaType',
        'stream_log.slug',
        'user.id',
        'user.userName',
        'user.email',
        'user.firstName',
        'user.lastName',
      ])
      .leftJoin('stream_log.user', 'user')
      .where('stream_log.slug = :slug', { slug })
      .paginate(query);
  }

  async getTotalViewers(slug: string) {
    return this.streamLogRepo
      .createQueryBuilder('stream_log')
      .select('COUNT(distinct stream_log.userId) AS total')
      .where('stream_log.slug = :slug', { slug })
      .andWhere('stream_log.event = :event', { event: 'play_started' })
      .getRawOne();
  }

  async getCurrentTotalViewers(slug: string) {
    return this.currentStreamViewerRepo
      .createQueryBuilder('current_stream_viewer')
      .select('COUNT(current_stream_viewer.userId) AS total')
      .where('current_stream_viewer.slug = :slug', { slug })
      .getRawOne();
  }
}

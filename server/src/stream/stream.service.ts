import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentStreamViewer } from 'entities/CurrentStreamViewer.entity';
import { Post } from 'entities/Post.entity';
import { StreamLog } from 'entities/StreamLog.entity';
import { User } from 'entities/User.entity';
import { fetchOrProduceNull } from 'helpers/utils';
import { MattermostService } from 'src/utils/mattermost.service';
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
    private readonly mattermostService: MattermostService,
  ) {}

  async setStreamEvent(info: ClientStreamEventDto) {
    const streamLog = this.streamLogRepo.create({
      event: info.event,
      slug: info.slug,
      mediaType: info.mediaType || 'video',
    });

    // user events
    if (['play_started', 'play_done'].includes(info.event)) {
      streamLog.userId = info.userId!;
      try {
        if (info.event === 'play_started') {
          // when the same event is sent for a user a unique constraint error would be thrown. It can be ignored.
          await this.currentStreamViewerRepo
            .create({
              userId: info.userId,
              slug: info.slug,
            })
            .save();
        } else {
          await this.currentStreamViewerRepo.delete({
            userId: info.userId,
            slug: info.slug,
          });
        }
        this.handleStreamViewerChange(info.slug, info.userId!);
      } catch (error) {
        //
      }
    }

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

    if (info.event === 'publish_started')
      await this.handleCreateStreamChannel(info.slug);

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

  async handleStreamViewerChange(slug: string, userId: number) {
    const stat = await this.getCurrentTotalViewers(slug);

    this.mattermostService.broadcastPost({
      event: 'LIVE_STREAM_VIEWER_COUNT_CHANGE',
      slug,
      count: stat.total,
    });

    const channel = await this.handleCreateStreamChannel(slug);

    if (channel) {
      const user = await this.userRepo.findOne({ where: { id: userId } });

      if (user) {
        fetchOrProduceNull(() =>
          this.mattermostService.mattermostClient.addToChannel(
            user.mattermostId,
            channel.id,
          ),
        );
      }
    }
  }

  async handleCreateStreamChannel(slug: string) {
    const channel = await fetchOrProduceNull(() =>
      this.mattermostService.mattermostClient.getChannelByName(
        this.mattermostService.octopusAppTeam!.id,
        slug,
      ),
    );
    if (channel) return channel;

    const octopusPost = await this.postRepo.findOne({ slug });

    if (octopusPost) {
      return this.mattermostService.mattermostClient.createChannel({
        name: slug,
        display_name: octopusPost.title,
        team_id: this.mattermostService.octopusAppTeam!.id,
        type: 'P',
        purpose: `Livestream channel for ${octopusPost.title} post`,
      } as any);
    }

    return null;
  }
}

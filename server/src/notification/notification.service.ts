import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'entities/Notification.entity';
import { Connection, In, IsNull, Repository } from 'typeorm';
import { ListNotificationQuery } from './dto/list-notification.query';

@Injectable()
export class NotificationService {
  constructor(
    private connection: Connection,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async getNotificationCount(userId: number) {
    const queryRunner = this.connection.createQueryRunner();
    const [
      result,
    ] = await queryRunner.query(
      'SELECT (SELECT COUNT(*) FROM notification WHERE "userId" = $1 AND "viewedOn" IS NULL) AS "unviewedCount", (SELECT COUNT(*) FROM notification WHERE "userId" = $1 AND "readOn" IS NULL) AS "unreadCount"',
      [userId],
    );

    return result;
  }

  async markNotificationsAsViewed(userId: number, notificationIds: number[]) {
    return this.notificationRepository.update(
      { id: In([...notificationIds]), userId },
      { viewedOn: new Date() },
    );
  }

  async markNotificationsAsRead(userId: number, notificationId?: number) {
    return this.notificationRepository.update(
      { userId, readOn: IsNull(), id: notificationId || undefined },
      { readOn: new Date() },
    );
  }

  async listNotifications(userId: number, query: ListNotificationQuery) {
    const baseQuery = this.notificationRepository
      .createQueryBuilder('notification')
      .select([
        'notification.id',
        'notification.createdOn',
        'notification.message',
        'notification.type',
        'notification.readOn',
        'notification.viewedOn',
        'notification.counter',
        'createdBy.id',
        'createdBy.fullName',
        'createdBy.userName',
        'createdBy.email',
        'createdBy.displayPhoto',
        'post.id',
        'post.title',
        'post.description',
        'post.slug',
        'post.type',
        'post.public',
        'post.videoName',
        'post.createdOn',
        'channel.id',
        'channel.name',
        'channel.description',
        'zone.id',
        'zone.name',
        'zone.subdomain',
        'zone.description',
      ])
      .leftJoin('notification.post', 'post')
      .leftJoinAndSelect('post.postReaction', 'postReaction')
      .leftJoin('post.channel', 'channel')
      .leftJoin('channel.zone', 'zone')
      .leftJoin('notification.createdBy', 'createdBy')
      .leftJoinAndSelect('notification.postComment', 'postComment')
      .leftJoinAndSelect('postComment.parent', 'parent')
      .where('notification.userId = :userId', { userId });

    if (query.type === 'read')
      baseQuery.andWhere('notification.readOn IS NOT NULL');
    else if (query.type === 'unread')
      baseQuery.andWhere('notification.readOn IS NULL');

    return baseQuery.paginate(query);
  }
}

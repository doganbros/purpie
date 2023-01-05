import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'entities/Channel.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { UserZone } from 'entities/UserZone.entity';
import { Zone } from 'entities/Zone.entity';
import { Notification } from 'entities/Notification.entity';
import { Brackets, getManager, IsNull, Repository } from 'typeorm';
import { PaginationQuery } from 'types/PaginationQuery';
import { Contact } from '../../../entities/Contact.entity';
import { User } from '../../../entities/User.entity';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Zone) private zoneRepository: Repository<Zone>,
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  getPublicChannelSuggestions(userId: string, query: PaginationQuery) {
    return this.channelRepository
      .createQueryBuilder('channel')
      .select([
        'channel.id',
        'channel.createdOn',
        'channel.name',
        'channel.description',
        'channel.public',
        'channel.displayPhoto',
        'zone.id',
        'zone.name',
        'zone.subdomain',
      ])
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(*)', 'membersCount')
          .where('user_channel.channelId = channel.id')
          .from(UserChannel, 'user_channel');
      }, 'channel_membersCount')
      .leftJoin('channel.zone', 'zone')
      .leftJoin(
        UserChannel,
        'user_channel',
        'user_channel.channelId = channel.id AND user_channel.userId = :userId',
        { userId },
      )
      .leftJoin(
        UserZone,
        'user_zone',
        'user_zone.zoneId = zone.id and user_zone.userId = :userId',
        { userId },
      )
      .where('channel.public = true')
      .andWhere(
        new Brackets((qb) => {
          qb.where('zone.public = true').orWhere('user_zone.id is not null');
        }),
      )
      .andWhere('user_channel.id is null')
      .orderBy('channel.createdOn', 'DESC')
      .paginateRaw(query);
  }

  getPublicZoneSuggestions(userId: string, query: PaginationQuery) {
    return this.zoneRepository
      .createQueryBuilder('zone')
      .select([
        'zone.id',
        'zone.name',
        'zone.displayPhoto',
        'zone.subdomain',
        'zone.description',
        'zone.createdOn',
        'zone.public',
      ])
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(*)', 'channelCount')
          .where('channel.zoneId = zone.id')
          .from(Channel, 'channel');
      }, 'zone_channelCount')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(*)', 'membersCount')
          .where('user_zone.zoneId = zone.id')
          .from(UserZone, 'user_zone');
      }, 'zone_membersCount')
      .leftJoin(
        UserZone,
        'user_zone',
        'user_zone.zoneId = zone.id and user_zone.userId = :userId',
        { userId },
      )
      .where('zone.public')
      .andWhere('user_zone.id is null')
      .orderBy('zone.createdOn', 'DESC')
      .paginateRaw(query);
  }

  getContactSuggestions(userId: string) {
    const entityManager = getManager();

    const baseQuery = this.userRepository
      .createQueryBuilder('user')
      .select('user.id', 'userId')
      .addSelect('user.fullName', 'fullName')
      .addSelect('user.email', 'email')
      .addSelect('user.userName', 'userName')
      .addSelect('user.displayPhoto', 'displayPhoto')
      .innerJoin(Contact, 'contact', 'user.id = contact.contactUserId')
      .innerJoin(
        Contact,
        'contactOfContact',
        'contact.userId = contactOfContact.contactUserId',
      )
      .andWhere(`contactOfContact.userId = ${userId}`)
      .andWhere(`user.id != ${userId}`)
      .andWhere(
        (qb) =>
          `user.id NOT IN ${qb
            .subQuery()
            .select('directContact.contactUserId')
            .from(Contact, 'directContact')
            .where(`directContact.userId = ${userId}`)
            .getQuery()}`,
      )
      .getSql();

    const baseQuery2 = this.userRepository
      .createQueryBuilder('user')
      .select('user.id', 'userId')
      .addSelect('user.fullName', 'fullName')
      .addSelect('user.email', 'email')
      .addSelect('user.userName', 'userName')
      .addSelect('user.displayPhoto', 'displayPhoto')
      .innerJoin(UserChannel, 'user_channel1', 'user.id = user_channel1.userId')
      .innerJoin(
        UserChannel,
        'user_channel2',
        'user_channel1.channelId = user_channel2.channelId',
      )
      .andWhere(`user_channel2.userId = ${userId}`)
      .andWhere(`user.id != ${userId}`)
      .andWhere(
        (qb) =>
          `user.id NOT IN ${qb
            .subQuery()
            .select('directContact.contactUserId')
            .from(Contact, 'directContact')
            .where(`directContact.userId = ${userId}`)
            .getQuery()}`,
      )
      .getSql();

    return entityManager
      .query(`${baseQuery} UNION ${baseQuery2}`)
      .then((t) => t);
  }

  getNotifications(userId: string, query: PaginationQuery) {
    return this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoin('notification.post', 'post')
      .leftJoin('notification.createdBy', 'createdBy')
      .select([
        'notification.id',
        'notification.message',
        'notification.type',
        'notification.readOn',
        'post.id',
        'post.title',
        'post.slug',
        'post.description',
        'post.startDate',
        'post.type',
        'post.createdOn',
        'post.public',
        'post.videoName',
        'post.channelId',
        'post.liveStream',
        'post.record',
        'createdBy.id',
        'createdBy.fullName',
        'createdBy.userName',
        'createdBy.displayPhoto',
        'createdBy.email',
      ])
      .where('notification.userId = :userId', { userId })
      .orderBy('notification.createdOn', 'DESC')
      .paginate(query);
  }

  markNotificationAsRead(userId: string, notificationId: string) {
    return this.notificationRepository.update(
      { id: notificationId, userId },
      { readOn: new Date() },
    );
  }

  markAllNotificationsAsRead(userId: string) {
    return this.notificationRepository.update(
      { userId, readOn: IsNull() },
      { readOn: new Date() },
    );
  }

  removeNotification(userId: string, notificationId: string) {
    return this.notificationRepository.delete({ id: notificationId, userId });
  }
}

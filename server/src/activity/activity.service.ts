import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'entities/Channel.entity';
import { Contact } from 'entities/Contact.entity';
import { Meeting } from 'entities/Meeting.entity';
import { User } from 'entities/User.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { UserZone } from 'entities/UserZone.entity';
import { Zone } from 'entities/Zone.entity';
import { Brackets, Repository } from 'typeorm';
import { PaginationQuery } from 'types/PaginationQuery';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Meeting) private meetingRepository: Repository<Meeting>,
    @InjectRepository(Zone) private zoneRepository: Repository<Zone>,
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  getPublicChannelSuggestions(userId: number, query: PaginationQuery) {
    return this.channelRepository
      .createQueryBuilder('channel')
      .select([
        'channel.id',
        'channel.createdOn',
        'channel.name',
        'channel.topic',
        'channel.description',
        'channel.active',
        'channel.public',
        'channel.categoryId',
        'category.id',
        'category.name',
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
      .leftJoin('channel.category', 'category')
      .leftJoin(
        UserChannel,
        'user_channel',
        'user_channel.channelId = channel.id AND user_channel.userId = :userId',
        { userId },
      )
      .where('channel.public = true')
      .andWhere('zone.public = true')
      .andWhere('user_channel.id is null')
      .orderBy('channel.createdOn', 'DESC')
      .paginateRaw(query);
  }

  getPublicZoneSuggestions(userId: number, query: PaginationQuery) {
    return this.zoneRepository
      .createQueryBuilder('zone')
      .select([
        'zone.id',
        'zone.name',
        'zone.subdomain',
        'zone.description',
        'zone.active',
        'zone.createdOn',
        'zone.public',
        'category.id',
        'category.name',
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
      .leftJoin('zone.category', 'category')
      .leftJoin(
        UserZone,
        'user_zone',
        'user_zone.zoneId = zone.id and user_zone.userId = :userId',
        { userId },
      )
      .where('zone.public = true')
      .where('user_zone.id is null')
      .orderBy('zone.createdOn', 'DESC')

      .paginateRaw(query);
  }

  getUserFeed(userId: number, query: PaginationQuery) {
    return this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'meeting.id',
        'meeting.title',
        'meeting.slug',
        'meeting.description',
        'meeting.startDate',
        'meeting.public',
        'meeting.channelId',
        'meeting.liveStream',
        'meeting.record',
        'zone_meeting.id',
        'zone_meeting.subdomain',
        'zone_meeting.description',
        'channel_meeting.id',
        'channel_meeting.name',
        'channel_meeting.topic',
        'channel_meeting.description',
        'meetingCreatedBy.id',
        'meetingCreatedBy.email',
        'meetingCreatedBy.firstName',
        'meetingCreatedBy.lastName',
      ])
      .leftJoin(Meeting, 'meeting', 'meeting.endDate is null')
      .leftJoin(
        UserChannel,
        'user_channel_meeting',
        'user_channel_meeting.userId = user.id AND meeting.channelId = user_channel_meeting.channelId',
      )
      .leftJoin(
        Channel,
        'channel_meeting',
        'channel_meeting.id = user_channel_meeting.channelId',
      )
      .leftJoin(
        Zone,
        'zone_meeting',
        'zone_meeting.id = channel_meeting.zoneId',
      )
      .leftJoin(
        Contact,
        'contact_meeting',
        'meeting.userContactExclusive = true AND contact_meeting.userId = meeting.createdById AND contact_meeting.contactUserId = user.id',
      )
      .leftJoin('meeting.createdBy', 'meetingCreatedBy')
      .where('user.id = :userId', { userId })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            new Brackets((qbi) => {
              qbi
                .orWhere('user_channel_meeting.id is not null')
                .orWhere('contact_meeting.contactUserId is not null')
                .orWhere('meeting.createdById = :userId', { userId });
            }),
          ); // other and where for videos and so on
        }),
      )
      .paginateRaw(query, false);
  }

  getZoneFeed(zoneId: number, query: PaginationQuery) {
    return this.zoneRepository
      .createQueryBuilder('zone')
      .select([
        'meeting.id',
        'meeting.title',
        'meeting.slug',
        'meeting.description',
        'meeting.startDate',
        'meeting.public',
        'meeting.liveStream',
        'meeting.record',
        'meetingCreatedBy.id',
        'meetingCreatedBy.email',
        'meetingCreatedBy.firstName',
        'meetingCreatedBy.lastName',
        'channel_meeting.id',
        'channel_meeting.name',
        'channel_meeting.topic',
        'channel_meeting.description',
      ])
      .leftJoin(Meeting, 'meeting', 'meeting.endDate is null')
      .leftJoin(
        Channel,
        'channel_meeting',
        'meeting.channelId = channel_meeting.id',
      )
      .leftJoin('meeting.createdBy', 'meetingCreatedBy')
      .where('channel_meeting.zoneId = :zoneId', { zoneId })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            new Brackets((qbi) => {
              qbi.where('meeting.channelId = channel_meeting.id');
            }),
          ); // other and where for videos and so on
        }),
      )
      .paginateRaw(query, false);
  }

  getChannelFeed(channelId: number, query: PaginationQuery) {
    return this.channelRepository
      .createQueryBuilder('channel')
      .select([
        'meeting.id',
        'meeting.title',
        'meeting.slug',
        'meeting.description',
        'meeting.startDate',
        'meeting.public',
        'meeting.liveStream',
        'meeting.record',
        'meetingCreatedBy.id',
        'meetingCreatedBy.email',
        'meetingCreatedBy.firstName',
        'meetingCreatedBy.lastName',
        'channel.id',
        'channel.name',
        'channel.topic',
        'channel.description',
      ])
      .leftJoin(
        Meeting,
        'meeting',
        'meeting.endDate is null and meeting.channelId = channel.id',
      )
      .leftJoin('meeting.createdBy', 'meetingCreatedBy')
      .where('channel.id = :channelId', { channelId })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            new Brackets((qbi) => {
              qbi.where('meeting.channelId = channel.id');
            }),
          ); // other and where for videos and so on
        }),
      )
      .paginateRaw(query, false);
  }

  getPublicFeed(query: PaginationQuery) {
    return this.meetingRepository
      .createQueryBuilder('meeting')
      .select([
        'meeting.title',
        'meeting.slug',
        'meeting.description',
        'meeting.startDate',
        'meeting.liveStream',
        'meeting.record',
        'meeting.public',
        'meetingCreatedBy.id',
        'meetingCreatedBy.email',
        'meetingCreatedBy.firstName',
        'meetingCreatedBy.lastName',
      ])
      .leftJoin('meeting.createdBy', 'meetingCreatedBy')
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            new Brackets((qbi) => {
              qbi.where('meeting.public = true');
            }),
          ); // other and where for videos and so on
        }),
      )
      .paginateRaw(query, false);
  }
}

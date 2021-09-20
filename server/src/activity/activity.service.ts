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
        'channel.public',
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

  getPublicZoneSuggestions(userId: number, query: PaginationQuery) {
    return this.zoneRepository
      .createQueryBuilder('zone')
      .select([
        'zone.id',
        'zone.name',
        'zone.subdomain',
        'zone.description',
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

  get baseActivitySelect() {
    return [
      'meeting.id',
      'meeting.title',
      'meeting.slug',
      'meeting.description',
      'meeting.startDate',
      'meeting.public',
      'meeting.userContactExclusive',
      'meeting.channelId',
      'meeting.liveStream',
      'meeting.record',
      'meetingCreatedBy.id',
      'meetingCreatedBy.email',
      'meetingCreatedBy.firstName',
      'meetingCreatedBy.lastName',
    ];
  }

  getUserFeed(userId: number, query: PaginationQuery) {
    return this.userRepository
      .createQueryBuilder('user')
      .select(this.baseActivitySelect)
      .addSelect([
        'user.id',
        'zone_meeting.id',
        'zone_meeting.name',
        'zone_meeting.subdomain',
        'zone_meeting.public',
        'channel_meeting.id',
        'channel_meeting.name',
        'channel_meeting.topic',
        'channel_meeting.description',
        'channel_meeting.public',
      ])
      .leftJoin(
        Meeting,
        'meeting',
        'meeting.conferenceEndDate is null or meeting.telecastRepeatUrl is not null',
      )
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
      .select(this.baseActivitySelect)
      .addSelect([
        'zone_meeting.id',
        'zone_meeting.name',
        'zone_meeting.subdomain',
        'zone_meeting.public',
        'channel_meeting.id',
        'channel_meeting.name',
        'channel_meeting.topic',
        'channel_meeting.description',
        'channel_meeting.public',
      ])
      .leftJoin(
        Meeting,
        'meeting',
        'meeting.conferenceEndDate is null or meeting.telecastRepeatUrl is not null',
      )
      .leftJoin(
        Channel,
        'channel_meeting',
        'meeting.channelId = channel_meeting.id',
      )
      .leftJoin(
        Zone,
        'zone_meeting',
        'zone_meeting.id = channel_meeting.zoneId',
      )
      .leftJoin('meeting.createdBy', 'meetingCreatedBy')
      .where(
        new Brackets((qb) => {
          qb.where('channel_meeting.zoneId = :zoneId', { zoneId });
        }),
      )
      .paginateRaw(query, false);
  }

  getChannelFeed(channelId: number, query: PaginationQuery) {
    return this.channelRepository
      .createQueryBuilder('channel')
      .select(this.baseActivitySelect)
      .addSelect([
        'channel.id',
        'channel.name',
        'channel.topic',
        'channel.description',
      ])
      .leftJoin(Meeting, 'meeting', 'meeting.channelId = channel.id')
      .leftJoin('meeting.createdBy', 'meetingCreatedBy')
      .where('channel.id = :channelId', { channelId })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            new Brackets((qbi) => {
              qbi.where('meeting.channelId = channel.id').andWhere(
                new Brackets((qbii) => {
                  qbii
                    .where('meeting.conferenceEndDate is null')
                    .orWhere('meeting.telecastRepeatUrl is not null');
                }),
              );
            }),
          ); // other and where for videos and so on
        }),
      )
      .paginateRaw(query, false);
  }

  getPublicFeed(query: PaginationQuery) {
    return this.meetingRepository
      .createQueryBuilder('meeting')
      .select(this.baseActivitySelect)
      .leftJoin('meeting.createdBy', 'meetingCreatedBy')
      .where(
        new Brackets((qb) => {
          qb.where(
            new Brackets((qbi) => {
              qbi.where('meeting.public = true').andWhere(
                new Brackets((qbii) => {
                  qbii
                    .where('meeting.conferenceEndDate is null')
                    .orWhere('meeting.telecastRepeatUrl is not null');
                }),
              );
            }),
          ); // other and where for videos and so on
        }),
      )
      .paginateRaw(query, false);
  }
}

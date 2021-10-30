import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'entities/Channel.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { UserZone } from 'entities/UserZone.entity';
import { Zone } from 'entities/Zone.entity';
import { Brackets, Repository } from 'typeorm';
import { PaginationQuery } from 'types/PaginationQuery';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Zone) private zoneRepository: Repository<Zone>,
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
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
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'entities/Channel.entity';
import { Contact } from 'entities/Contact.entity';
import { Post } from 'entities/Post.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { UserZone } from 'entities/UserZone.entity';
import { Zone } from 'entities/Zone.entity';
import { booleanValue } from 'helpers/utils';
import { Brackets, Repository } from 'typeorm';
import { PaginationQuery } from 'types/PaginationQuery';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
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

  baseActivity(query: Record<string, any>, userId: number) {
    const builder = this.postRepository
      .createQueryBuilder('post')
      .select([
        'post.id',
        'post.title',
        'post.slug',
        'post.description',
        'post.startDate',
        'post.type',
        'post.createdOn',
        'post.public',
        'post.videoName',
        'tags.value',
        'post.userContactExclusive',
        'post.channelId',
        'post.liveStream',
        'post.record',
        'createdBy.id',
        'createdBy.email',
        'createdBy.firstName',
        'createdBy.lastName',
        '(select count(*) from post_like where "postId" = post.id) AS "post_likesCount"',
        '(select count(*) from post_comment where "postId" = post.id) AS "post_commentsCount"',
        'COALESCE((select cast(id as boolean) from post_like where post.id = "post_like"."postId" and "post_like"."userId" = :currentUserId limit 1), false) AS "post_liked"',
      ])
      .setParameter('currentUserId', userId)
      .leftJoin('post.createdBy', 'createdBy')
      .leftJoin('post.tags', 'tags')
      .where(
        new Brackets((qb) => {
          qb.where(
            new Brackets((qbi) => {
              qbi
                .where('post.type = :meetingType', { meetingType: 'meeting' })
                .andWhere(
                  new Brackets((qbii) => {
                    qbii
                      .where('post.conferenceEndDate is null')
                      .orWhere('post.videoName is not null');
                  }),
                );
            }),
          ).orWhere('post.type = :videoType', {
            videoType: 'video',
          });
        }),
      )
      .orderBy('post.id', 'DESC');

    if (query.title)
      builder.andWhere('post.title = :title', { title: query.title });
    if (query.postType)
      builder.andWhere('post.type = :postType', {
        postType: query.postType,
      });
    if (query.streaming)
      builder.andWhere('post.streaming = :streaming', {
        streaming: booleanValue(query.streaming),
      });
    return builder;
  }

  getUserFeed(userId: number, query: PaginationQuery) {
    return this.baseActivity(query, userId)
      .addSelect([
        'zone.id',
        'zone.name',
        'zone.subdomain',
        'zone.public',
        'channel.id',
        'channel.name',
        'channel.topic',
        'channel.description',
        'channel.public',
      ])
      .addSelect([
        '(select case when id is null then false else true end from post_like ) AS "post_liked"',
      ])
      .leftJoin('post.channel', 'channel')
      .leftJoin(
        UserChannel,
        'userChannel',
        'userChannel.channelId = channel.id and userChannel.userId = :userId',
        { userId },
      )
      .leftJoin('channel.zone', 'zone')
      .leftJoin(
        Contact,
        'contact',
        'post.userContactExclusive = true AND contact.userId = post.createdById AND contact.contactUserId = :userId',
        { userId },
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            new Brackets((qbi) => {
              qbi
                .orWhere('userChannel.id is not null')
                .orWhere('contact.contactUserId is not null')
                .orWhere('post.createdById = :userId', { userId });
            }),
          );
        }),
      )
      .paginateRaw(query, {
        primaryAlias: 'post',
        aliases: ['channel', 'zone', 'tags'],
      });
  }

  getZoneFeed(zoneId: number, userId: number, query: PaginationQuery) {
    return this.baseActivity(query, userId)
      .addSelect([
        'zone.id',
        'zone.name',
        'zone.subdomain',
        'zone.public',
        'channel.id',
        'channel.name',
        'channel.topic',
        'channel.description',
        'channel.public',
      ])
      .innerJoin('post.channel', 'channel')
      .innerJoin(
        UserChannel,
        'user_channel',
        'user_channel.channelId = channel.id and user_channel.userId = :userId',
        { userId },
      )
      .innerJoin('channel.zone', 'zone')
      .andWhere('channel.zoneId = :zoneId', { zoneId })
      .paginateRaw(query, {
        primaryAlias: 'post',
        aliases: ['channel', 'zone', 'tags'],
      });
  }

  getChannelFeed(channelId: number, userId: number, query: PaginationQuery) {
    return this.baseActivity(query, userId)
      .addSelect([
        'zone.id',
        'zone.name',
        'zone.subdomain',
        'zone.public',
        'channel.id',
        'channel.name',
        'channel.topic',
        'channel.description',
      ])
      .innerJoin('post.channel', 'channel')
      .innerJoin('channel.zone', 'zone')
      .innerJoin(
        UserChannel,
        'userChannel',
        'userChannel.channelId = :channelId and userChannel.userId = :userId',
        { userId, channelId },
      )
      .paginateRaw(query, {
        primaryAlias: 'post',
        aliases: ['channel', 'zone', 'tags'],
      });
  }

  getPublicFeed(query: PaginationQuery, userId: number) {
    return this.baseActivity(query, userId)
      .andWhere('post.public = true')
      .paginateRaw(query, {
        primaryAlias: 'post',
        aliases: ['createdBy', 'tags'],
      });
  }
}

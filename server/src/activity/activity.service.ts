import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'entities/Channel.entity';
import { Contact } from 'entities/Contact.entity';
import { Post } from 'entities/Post.entity';
import { PostComment } from 'entities/PostComment.entity';
import { PostLike } from 'entities/PostLike.entity';
import { SavedPost } from 'entities/SavedPost.entity';
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
        'tags.id',
        'tags.value',
        'post.userContactExclusive',
        'post.channelId',
        'post.liveStream',
        'post.record',
        'createdBy.id',
        'createdBy.email',
        'createdBy.firstName',
        'createdBy.lastName',
      ])
      .addSelect(
        (sq) =>
          sq
            .select('count(*)')
            .from(PostLike, 'post_like')
            .where('post_like.postId = post.id'),
        'post_likesCount',
      )
      .addSelect(
        (sq) =>
          sq
            .select('count(*)')
            .from(PostComment, 'post_comment')
            .where('post_comment.postId = post.id'),
        'post_commentsCount',
      )
      .addSelect(
        (sq) =>
          sq
            .select('count(*) > 0')
            .from(PostLike, 'user_post_like')
            .where('user_post_like.postId = post.id')
            .andWhere('user_post_like.userId = :currentUserId'),
        'post_liked',
      )
      .addSelect(
        (sq) =>
          sq
            .select('count(*) > 0')
            .from(SavedPost, 'user_saved_post')
            .where('user_saved_post.postId = post.id')
            .andWhere('user_saved_post.userId = :currentUserId'),
        'post_saved',
      )

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

  getUserFeedSelection(
    userId: number,
    query: Record<string, any> = {},
    includePublic = false,
  ) {
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
              if (includePublic) qbi.orWhere('post.public = true');
              qbi
                .orWhere('userChannel.id is not null')
                .orWhere('contact.contactUserId is not null')
                .orWhere('post.createdById = :userId', { userId });
            }),
          );
        }),
      );
  }

  getUserFeed(userId: number, query: PaginationQuery) {
    return this.getUserFeedSelection(userId, query).paginateRawAndEntities(
      {
        otherFields: ['commentsCount', 'likesCount', 'liked', 'saved'],
        primaryColumnName: 'id',
        primaryTableAliasName: 'post',
      },
      query,
    );
  }

  getPostById(userId: number, postId: number) {
    return this.getUserFeedSelection(userId, {}, true)
      .andWhere('post.id = :postId', { postId })
      .getRawOneAndEntity(
        ['commentsCount', 'likesCount', 'liked', 'saved'],
        'post',
      );
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
      .paginateRawAndEntities(
        {
          otherFields: ['commentsCount', 'likesCount', 'liked', 'saved'],
          primaryColumnName: 'id',
          primaryTableAliasName: 'post',
        },
        query,
      );
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
      .paginateRawAndEntities(
        {
          otherFields: ['commentsCount', 'likesCount', 'liked', 'saved'],
          primaryColumnName: 'id',
          primaryTableAliasName: 'post',
        },
        query,
      );
  }

  getPublicFeed(query: PaginationQuery, userId: number) {
    return this.baseActivity(query, userId)
      .andWhere('post.public = true')
      .paginateRawAndEntities(
        {
          otherFields: ['commentsCount', 'likesCount', 'liked', 'saved'],
          primaryColumnName: 'id',
          primaryTableAliasName: 'post',
        },
        query,
      );
  }
}

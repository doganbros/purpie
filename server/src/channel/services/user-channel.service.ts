import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'entities/Channel.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { UserZone } from 'entities/UserZone.entity';
import { Brackets, getManager, Repository } from 'typeorm';

@Injectable()
export class UserChannelService {
  constructor(
    @InjectRepository(UserChannel)
    private userChannelRepository: Repository<UserChannel>,
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
  ) {}

  async getUserChannel(userId: number, params: Record<string, any>) {
    const baseQuery = this.userChannelRepository
      .createQueryBuilder('user_channel')
      .select(['user_channel.id', 'user_channel.createdOn'])
      .innerJoinAndSelect('user_channel.channel', 'channel')
      .innerJoinAndSelect(
        'user_channel.channelRole',
        'channelRole',
        'channelRole.channelId = channel.id AND channelRole.roleCode = user_channel.channelRoleCode',
      )
      .where('user_channel.userId = :userId', { userId });

    if (params.channelId)
      baseQuery.andWhere('channel.id = :channelId', {
        channelId: params.channelId,
      });
    if (params.userChannelId)
      baseQuery.andWhere('user_channel.id = :userChannelId', {
        userChannelId: params.userChannelId,
      });

    return baseQuery.getOne();
  }

  async getCurrentUserZoneChannels(
    identifier: number | string,
    userId: string,
  ) {
    const records = await this.channelRepository
      .createQueryBuilder('channel')
      .select([
        'user_channel.id',
        'user_channel.createdOn',
        'channel.id',
        'channel.createdOn',
        'channel.name',
        'channel.displayPhoto',
        'channel.backgroundPhoto',
        'channel.description',
        'channel.public',
        'channel.zoneId',
        'createdBy.id',
        'createdBy.fullName',
        'createdBy.email',
      ])
      .innerJoin('channel.zone', 'zone')
      .leftJoin('channel.createdBy', 'createdBy')
      .leftJoin(
        UserZone,
        'user_zone',
        'user_zone.zoneId = zone.id and user_zone.userId = :userId',
        { userId },
      )
      .leftJoin(
        UserChannel,
        'user_channel',
        'user_channel.channelId = channel.id and user_channel.userId = :userId',
        { userId },
      )
      .leftJoinAndSelect(
        'user_channel.channelRole',
        'channel_role',
        'channel_role.roleCode = user_channel.channelRoleCode AND channel_role.channelId = channel.id',
      )
      .where(
        typeof identifier === 'string'
          ? 'zone.subdomain = :identifier'
          : 'zone.id = :identifier',
        { identifier },
      )
      .andWhere(
        new Brackets((qi) => {
          qi.where('zone.public = true').orWhere('user_zone.id is not null');
        }),
      )
      .andWhere(
        new Brackets((qi) => {
          qi.where('channel.public = true').orWhere(
            'user_channel.id is not null',
          );
        }),
      );

    const userChannels = await records.getRawMany();
    for (const userChannel of userChannels!) {
      const channelCounts = await getManager()
        .query(`SELECT unseenPost.count as "unseenPostCount", livePost.count as "livePostCount" 
                        FROM (SELECT cast(count(*) as int)
                        FROM "user_log" "user_log"
                                 LEFT JOIN "post" "post" ON "post"."channelId" = "user_log"."channelId"
                        WHERE "user_log"."channelId" = '${userChannel.channel_id}'
                          AND "user_log"."createdById" = '${userId}'
                          AND "user_log"."createdOn" = (SELECT max(ul."createdOn") FROM user_log ul WHERE "ul"."channelId" = '${userChannel.channel_id}')
                          AND "user_log"."createdOn" < "post"."createdOn") as unseenPost,
                       (SELECT cast(count(*) as int)
                        FROM "post" "post"
                        WHERE "post"."channelId" = '${userChannel.channel_id}'
                          AND "post"."liveStream" = true) as livePost`);

      const count = channelCounts[0];
      userChannel.unseenPostCount = count.unseenPostCount;
      userChannel.livePostCount = count.livePostCount;
    }

    return this.mapUserChannel(userChannels);
  }

  mapUserChannel(records: any) {
    return records.map((record: any) => ({
      id: record.user_channel_id,
      createdOn: record.user_channel_createdOn,
      channel: {
        id: record.channel_id,
        createdOn: record.channel_createdOn,
        name: record.channel_name,
        description: record.channel_description,
        public: record.channel_public,
        zoneId: record.channel_zoneId,
        displayPhoto: record.channel_displayPhoto,
        createdBy: {
          id: record.createdBy_id,
          fullName: record.createdBy_fullName,
          email: record.createdBy_email,
        },
      },
      channelRole: {
        roleCode: record.channel_role_roleCode,
        roleName: record.channel_role_roleName,
        canInvite: record.channel_role_canInvite,
        canDelete: record.channel_role_canDelete,
        canEdit: record.channel_role_canEdit,
        canManageRole: record.channel_role_canManageRole,
      },
      unseenPostCount: record.unseenPostCount,
      livePostCount: record.livePostCount,
    }));
  }

  async getCurrentUserChannels(
    userId: string,
    subdomain: string | null = null,
  ) {
    if (subdomain) return this.getCurrentUserZoneChannels(subdomain, userId);

    return this.getUserAllChannels(userId);
  }

  async getUserAllChannels(userId: string) {
    const records = await this.userChannelRepository
      .createQueryBuilder('user_channel')
      .select([
        'user_channel.id',
        'user_channel.createdOn',
        'channel.id',
        'channel.createdOn',
        'channel.name',
        'channel.description',
        'channel.displayPhoto',
        'channel.backgroundPhoto',
        'channel.public',
        'channel.zoneId',
        'createdBy.id',
        'createdBy.fullName',
        'createdBy.email',
      ])
      .leftJoin('user_channel.channel', 'channel')
      .leftJoin('channel.createdBy', 'createdBy')
      .leftJoin('post', 'post', 'post.channelId = channel.id')
      .leftJoin('post_reaction', 'ps', 'ps.postId = post.id')
      .leftJoinAndSelect(
        'user_channel.channelRole',
        'channel_role',
        'channel_role.roleCode = user_channel.channelRoleCode AND channel_role.channelId = channel.id',
      )
      .where('user_channel.userId = :userId', { userId })
      .orderBy(
        '-(ps.commentsCount + ps.dislikesCount + ps.likesCount + ps.liveStreamViewersCount + ps.viewsCount)',
        'ASC',
      );

    const userChannels = await records.getMany();
    for (const userChannel of userChannels!) {
      const channelCounts = await getManager()
        .query(`SELECT unseenPost.count as "unseenPostCount", livePost.count as "livePostCount" 
                        FROM (SELECT cast(count(*) as int)
                        FROM "user_log" "user_log"
                                 LEFT JOIN "post" "post" ON "post"."channelId" = "user_log"."channelId"
                        WHERE "user_log"."channelId" = '${userChannel.channel.id}'
                          AND "user_log"."createdById" = '${userId}'
                          AND "user_log"."createdOn" = (SELECT max(ul."createdOn") FROM user_log ul WHERE "ul"."channelId" = '${userChannel.channel.id}')
                          AND "user_log"."createdOn" < "post"."createdOn") as unseenPost,
                       (SELECT cast(count(*) as int)
                        FROM "post" "post"
                        WHERE "post"."channelId" = '${userChannel.channel.id}'
                          AND "post"."liveStream" = true) as livePost`);

      const count = channelCounts[0];
      userChannel.unseenPostCount = count.unseenPostCount;
      userChannel.livePostCount = count.livePostCount;
    }

    return userChannels;
  }
}

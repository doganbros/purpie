import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'entities/Channel.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { UserZone } from 'entities/UserZone.entity';
import { Brackets, Repository } from 'typeorm';

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
    userId: number,
  ) {
    const records = await this.channelRepository
      .createQueryBuilder('channel')
      .select([
        'user_channel.id',
        'user_channel.createdOn',
        'channel.id',
        'channel.createdOn',
        'channel.name',
        'channel.topic',
        'channel.displayPhoto',
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
        'user_zone.zoneId = channel.id and user_zone.userId = :userId',
        { userId },
      )
      .leftJoin(
        UserChannel,
        'user_channel',
        'user_channel.channelId = channel.id and user_channel.userId = :userId',
        { userId },
      )
      .leftJoinAndSelect('channel.category', 'category')
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
      )
      .getRawMany();

    return records.map((record) => ({
      id: record.user_channel_id,
      createdOn: record.user_channel_createdOn,
      channel: {
        id: record.channel_id,
        createdOn: record.channel_createdOn,
        name: record.channel_name,
        topic: record.channel_topic,
        description: record.channel_description,
        public: record.channel_public,
        zoneId: record.channel_zoneId,
        createdBy: {
          id: record.createdBy_id,
          fullName: record.createdBy_fullName,
          email: record.createdBy_email,
        },
      },
      chanelRole: {
        roleCode: record.channel_role_roleCode,
        roleName: record.channel_role_roleName,
        canInvite: record.channel_role_canInvite,
        canDelete: record.channel_role_canDelete,
        canEdit: record.channel_role_canEdit,
        canManageRole: record.channel_role_canManageRole,
      },
    }));
  }

  async getCurrentUserChannels(
    userId: number,
    subdomain: string | null = null,
  ) {
    if (subdomain) return this.getCurrentUserZoneChannels(subdomain, userId);

    return this.userChannelRepository
      .createQueryBuilder('user_channel')
      .select([
        'user_channel.id',
        'user_channel.createdOn',
        'channel.id',
        'channel.createdOn',
        'channel.name',
        'channel.topic',
        'channel.description',
        'channel.displayPhoto',
        'channel.public',
        'channel.zoneId',
        'createdBy.id',
        'createdBy.fullName',
        'createdBy.email',
      ])
      .leftJoin('user_channel.channel', 'channel')
      .leftJoin('channel.createdBy', 'createdBy')
      .leftJoinAndSelect('channel.category', 'category')
      .leftJoinAndSelect(
        'user_channel.channelRole',
        'channel_role',
        'channel_role.roleCode = user_channel.channelRoleCode AND channel_role.channelId = channel.id',
      )
      .where('user_channel.userId = :userId', { userId })
      .orderBy('user_channel.createdOn', 'DESC')
      .getMany();
  }
}

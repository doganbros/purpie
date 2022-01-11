import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'entities/Channel.entity';
import { Invitation } from 'entities/Invitation.entity';
import { User } from 'entities/User.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { UserZone } from 'entities/UserZone.entity';
import { Zone } from 'entities/Zone.entity';
import { tsqueryParam } from 'helpers/utils';
import { pick } from 'lodash';
import {
  UserProfile,
  UserTokenPayload,
} from 'src/auth/interfaces/user.interface';
import { MailService } from 'src/mail/mail.service';
import { Brackets, Repository } from 'typeorm';
import { CreateChannelDto } from './dto/create-channel.dto';
import { SearchChannelQuery } from './dto/search-channel.query';
import { UpdateChannelUserRoleDto } from './dto/update-channel-user-role.dto';

const { REACT_APP_CLIENT_HOST = 'http://localhost:3000' } = process.env;

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
    @InjectRepository(UserChannel)
    private userChannelRepository: Repository<UserChannel>,
    @InjectRepository(Invitation)
    private invitationRepository: Repository<Invitation>,
    private mailService: MailService,
  ) {}

  async createChannel(
    userId: number,
    userZoneId: number,
    zoneId: number,
    createChannelInfo: CreateChannelDto,
    defaultChannel = false,
  ) {
    return this.userChannelRepository
      .create({
        userId,
        userZoneId,
        channelRoleCode: 'SUPER_ADMIN',
        channel: await this.channelRepository
          .create({
            name: createChannelInfo.name,
            zoneId,
            public: createChannelInfo.public,
            description: createChannelInfo.description,
            topic: createChannelInfo.topic,
            categoryId: defaultChannel ? null : createChannelInfo.categoryId,
            createdById: userId,
          })
          .save(),
      })
      .save();
  }

  async sendChannelInfo(
    zone: Zone,
    channel: Channel,
    userPayload: UserProfile,
  ) {
    const clientUrl = new URL(REACT_APP_CLIENT_HOST);

    const context = {
      zoneName: zone.name,
      channelName: channel.name,
      firstName: userPayload.firstName,
      lastName: userPayload.lastName,
      link: `${clientUrl.protocol}//${zone.subdomain}.${clientUrl.host}/channel/${channel.id}`,
    };
    return this.mailService.sendMailByView(
      userPayload.email,
      `New Channel '${channel.name}' Created`,
      'new-channel-created',
      context,
    );
  }

  async getUserChannel(userId: number, params: Record<string, any>) {
    return this.userChannelRepository.findOne({
      where: {
        userId,
        ...params,
      },
      relations: ['channel', 'channelRole'],
    });
  }

  async getPublicChannels(userId: number, zoneId: number) {
    return this.channelRepository
      .createQueryBuilder('channel')
      .select([
        'channel.id',
        'channel.createdOn',
        'channel.name',
        'channel.displayPhoto',
        'channel.topic',
        'channel.description',
        'channel.public',
      ])
      .innerJoin('channel.zone', 'zone')
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
      .where('zone.id = :zoneId', { zoneId })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            new Brackets((qbi) => {
              qbi
                .where('zone.public = true')
                .orWhere('user_zone.id is not null');
            }),
          ).andWhere(
            new Brackets((qbi) => {
              qbi
                .where('channel.public = true')
                .orWhere('user_channel.id is not null');
            }),
          );
        }),
      )
      .getMany();
  }

  async searchChannel(
    userPayload: UserTokenPayload,
    query: SearchChannelQuery,
  ) {
    const baseQuery = this.channelRepository
      .createQueryBuilder('channel')
      .select([
        'channel.id',
        'channel.createdOn',
        'channel.name',
        'channel.topic',
        'channel.description',
        'channel.displayPhoto',
        'channel.public',
        'zone.id',
        'zone.name',
        'zone.subdomain',
        'zone.description',
      ])
      .addSelect(
        `ts_rank(channel.search_document, to_tsquery('simple', :searchTerm))`,
        'search_rank',
      )
      .innerJoin('channel.zone', 'zone')
      .leftJoin(
        UserChannel,
        'user_channel',
        'channel.id = user_channel.channelId and user_channel.userId = :userId',
        { userId: userPayload.id },
      )
      .setParameter('searchTerm', tsqueryParam(query.searchTerm))
      .where(
        new Brackets((qb) => {
          qb.where('channel.public = true').orWhere(
            'user_channel.id is not null',
          );
        }),
      )
      .andWhere(`channel.search_document @@ to_tsquery('simple', :searchTerm)`)
      .orderBy('search_rank', 'DESC');

    if (query.zoneId)
      baseQuery.andWhere('channel.zoneId = :zoneId', { zoneId: query.zoneId });
    return baseQuery.paginate(query);
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
        'createdBy.firstName',
        'createdBy.lastName',
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
      .leftJoinAndSelect('user_channel.channelRole', 'channel_role')
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
          firstName: record.createdBy_firstName,
          lastName: record.createdBy_lastName,
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
        'createdBy.firstName',
        'createdBy.lastName',
        'createdBy.email',
      ])
      .leftJoin('user_channel.channel', 'channel')
      .leftJoin('channel.createdBy', 'createdBy')
      .leftJoinAndSelect('channel.category', 'category')
      .leftJoinAndSelect('user_channel.channelRole', 'channel_role')
      .where('user_channel.userId = :userId', { userId })
      .orderBy('user_channel.createdOn', 'DESC')
      .getMany();
  }

  async validateJoinPublicChannel(userId: number, channelId: number) {
    const channel = await this.channelRepository
      .createQueryBuilder('channel')
      .leftJoin(
        UserChannel,
        'user_channel',
        'user_channel.channelId = channel.id',
      )
      .leftJoin(User, 'user', 'user.id = user_channel.userId')
      .leftJoin('channel.zone', 'zone')
      .leftJoin(
        UserZone,
        'user_zone',
        'user_zone.id = zone.id and user_zone.userId = user.id',
      )
      .where('channel.public = true')
      .andWhere('channel.id = :channelId', { channelId })
      .andWhere('user.id <> :userId', { userId })
      .andWhere(
        new Brackets((qb) => {
          qb.where('zone.public = true').orWhere('user_zone.id is not null');
        }),
      )
      .getOne();

    return channel;
  }

  async addUserToChannel(
    userId: number,
    userZoneId: number,
    channelId: number,
  ) {
    return this.userChannelRepository
      .create({
        userId,
        channelRoleCode: 'NORMAL',
        channelId,
        userZoneId,
      })
      .save();
  }

  async validateInviteUser(email: string, channelId: number) {
    const invitation = await this.invitationRepository.findOne({
      where: { email, channelId },
    });

    if (invitation)
      throw new BadRequestException(
        `The user with the email ${email} has already been invited to this channel`,
        'USER_ALREADY_INVITED_TO_CHANNEL',
      );

    const channel = await this.channelRepository
      .createQueryBuilder('channel')
      .select('user.id', 'userId')
      .innerJoin(
        UserChannel,
        'user_channel',
        'user_channel.channelId = channel.id',
      )
      .innerJoin(User, 'user', 'user.id = user_channel.userId')
      .where('user.email = :email', { email })
      .getRawOne();

    if (channel)
      throw new BadRequestException(
        `The user with the email ${email} is already a member of this channel`,
      );
  }

  async addUserToChannelInvitation(
    email: string,
    channelId: number,
    userId: number,
  ) {
    return this.invitationRepository
      .create({
        email,
        channelId,
        createdById: userId,
      })
      .save();
  }

  async sendChannelInvitationMail(channel: Channel, email: string) {
    const clientUrl = new URL(REACT_APP_CLIENT_HOST);

    const context = {
      name: channel.name,
      link: `${clientUrl.protocol}//${clientUrl.host}/respond-to-invitation/channel/${channel.id}`,
    };
    return this.mailService.sendMailByView(
      email,
      `Invitation To '${channel.name}' Channel`,
      'channel-invitation',
      context,
    );
  }

  async removeInvitation(email: string, channelId: number) {
    return this.invitationRepository.delete({ email, channelId });
  }

  async changeDisplayPhoto(channelId: number, fileName: string) {
    return this.channelRepository.update(
      { id: channelId },
      { displayPhoto: fileName },
    );
  }

  async validateInvitationResponse(invitationId: number, email: string) {
    return this.invitationRepository.findOne({
      where: {
        email,
        id: invitationId,
      },
      relations: ['channel'],
    });
  }

  async deleteByChannelId(id: number) {
    return this.channelRepository.delete({ id });
  }

  async editChannelById(id: number, editInfo: any) {
    return this.channelRepository.update(
      { id },
      pick(editInfo, ['name', 'description', 'topic', 'public']),
    );
  }

  async updateChannelUserRole(info: UpdateChannelUserRoleDto) {
    return this.userChannelRepository.update(
      { userId: info.userId, channelId: info.channelId },
      { channelRoleCode: info.channelRoleCode },
    );
  }
}

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'entities/Channel.entity';
import { ChannelRole } from 'entities/ChannelRole.entity';
import { defaultChannelRoles } from 'entities/data/default-roles';
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
import { SystemUserListQuery } from 'src/user/dto/system-user-list.query';
import { Brackets, Not, Repository } from 'typeorm';
import { PostSettings } from 'types/PostSettings';
import { CreateChannelDto } from '../dto/create-channel.dto';
import { SearchChannelQuery } from '../dto/search-channel.query';
import { UpdateChannelPermission } from '../dto/update-channel-permission.dto';
import { UpdateChannelUserRoleDto } from '../dto/update-channel-user-role.dto';
import { ErrorTypes } from '../../../types/ErrorTypes';

const { REACT_APP_CLIENT_HOST = 'http://localhost:3000' } = process.env;

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
    @InjectRepository(UserChannel)
    private userChannelRepository: Repository<UserChannel>,
    @InjectRepository(ChannelRole)
    private channelRoleRepository: Repository<ChannelRole>,
    @InjectRepository(Invitation)
    private invitationRepository: Repository<Invitation>,
    private mailService: MailService,
  ) {}

  async createChannel(
    userId: number,
    userZoneId: number,
    zoneId: number,
    createChannelInfo: CreateChannelDto,
  ) {
    const userChannel = await this.userChannelRepository
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
            createdById: userId,
          })
          .save(),
      })
      .save();

    await this.channelRoleRepository.insert(
      defaultChannelRoles.map((v) => ({
        ...v,
        channelId: userChannel.channel.id,
      })),
    );

    return userChannel;
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
      fullName: userPayload.fullName,
      link: `${clientUrl.protocol}//${zone.subdomain}.${clientUrl.host}/channel/${channel.id}`,
    };
    return this.mailService.sendMailByView(
      userPayload.email,
      `New Channel '${channel.name}' Created`,
      'new-channel-created',
      context,
    );
  }

  async getPublicChannels(userId: number, zoneId: number) {
    return this.channelRepository
      .createQueryBuilder('channel')
      .select([
        'channel.id',
        'channel.createdOn',
        'channel.name',
        'channel.displayPhoto',
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
        ErrorTypes.USER_ALREADY_INVITED_TO_CHANNEL,
        `The user with the email ${email} has already been invited to this channel`,
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
        ErrorTypes.USER_ALREADY_MEMBER_OF_CHANNEL,
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
      pick(editInfo, ['name', 'description', 'public']),
    );
  }

  listChannelRoles(channelId: number) {
    return this.channelRoleRepository.find({ take: 30, where: { channelId } });
  }

  listChannelUsers(channelId: number, query: SystemUserListQuery) {
    const baseQuery = this.userChannelRepository
      .createQueryBuilder('userChannel')
      .select([
        'userChannel.id',
        'userChannel.createdOn',
        'user.id',
        'user.fullName',
        'user.email',
        'user.userName',
        'user.displayPhoto',
      ])
      .innerJoin('userChannel.user', 'user')
      .leftJoinAndSelect('userChannel.channelRole', 'channelRole')
      .where('userChannel.channelId = :channelId', { channelId });

    if (query.name) {
      baseQuery
        .setParameter('searchTerm', tsqueryParam(query.name))
        .addSelect(
          `ts_rank(user.search_document, to_tsquery('simple', :searchTerm))`,
          'search_rank',
        )
        .andWhere(`user.search_document @@ to_tsquery('simple', :searchTerm)`)
        .orderBy('search_rank', 'DESC');
    } else {
      baseQuery.orderBy('user.fullName').addOrderBy('user.fullName');
    }

    return baseQuery.paginate(query);
  }

  async changeUserChannelRole(
    channelId: number,
    info: UpdateChannelUserRoleDto,
  ) {
    const { channelRoleCode } = info;
    if (channelRoleCode !== 'SUPER_ADMIN') {
      const remainingSuperAdminCount = await this.userChannelRepository.count({
        where: {
          channelId,
          userId: Not(info.userId),
          channelRoleCode: 'SUPER_ADMIN',
        },
      });

      if (remainingSuperAdminCount === 0)
        throw new ForbiddenException(
          ErrorTypes.SUPER_ADMIN_NOT_EXIST,
          'There must be at least one super admin',
        );
    }

    return this.userChannelRepository.update(
      { userId: info.userId, channelId },
      {
        channelRoleCode: info.channelRoleCode,
      },
    );
  }

  async createChannelRole(channelId: number, info: ChannelRole) {
    const existingRoleCodes = await this.channelRoleRepository.count({
      where: { roleCode: info.roleCode, channelId },
    });

    if (existingRoleCodes)
      throw new BadRequestException(
        ErrorTypes.ROLE_CODE_ALREADY_EXISTS,
        `The role code ${info.roleCode} already exists`,
      );

    return this.channelRoleRepository.create({ ...info, channelId }).save();
  }

  async removeChannelRole(channelId: number, roleCode: any) {
    const existing = await this.userChannelRepository.count({
      where: { channelRoleCode: roleCode, channelId },
    });

    if (existing)
      throw new ForbiddenException(
        ErrorTypes.USERS_USING_ROLE,
        'Users using this role already exists',
      );

    return this.channelRoleRepository
      .delete({ roleCode, isSystemRole: false, channelId })
      .then((res) => res.affected);
  }

  async editChannelRolePermissions(
    channelId: number,
    roleCode: string,
    info: Partial<UpdateChannelPermission>,
  ) {
    if (roleCode === 'SUPER_ADMIN')
      throw new ForbiddenException(
        ErrorTypes.CHANGE_SUPER_ADMIN_PERMISSION,
        "Super Admin Permissions can't be changed",
      );

    const updates: Partial<UpdateChannelPermission> = {};

    const fields = [
      'canInvite',
      'canDelete',
      'canEdit',
      'canManageRole',
    ] as const;

    fields.forEach((v) => {
      if (info[v] !== undefined) updates[v] = info[v];
    });

    if (!Object.keys(updates).length)
      throw new BadRequestException(
        ErrorTypes.FIELDS_FOR_UPDATES_NOT_SPECIFIED,
        'Fields for updates not specified',
      );

    return this.channelRoleRepository.update({ roleCode, channelId }, updates);
  }

  async getPostSettings(channelId: number) {
    return this.channelRepository
      .findOne({
        where: { id: channelId },
        select: ['postSettings'],
      })
      .then((res) => res?.postSettings);
  }

  async updatePostSettings(channelId: number, settings: PostSettings) {
    const updates: Partial<PostSettings> = {};

    const channel = await this.channelRepository.findOne(channelId, {
      select: ['postSettings'],
    });

    if (!channel)
      throw new NotFoundException(
        'Channel not found',
        ErrorTypes.CHANNEL_NOT_FOUND,
      );

    updates.allowComment =
      settings.allowComment ?? channel.postSettings.allowComment;
    updates.allowDislike =
      settings.allowDislike ?? channel.postSettings.allowDislike;
    updates.allowReaction =
      settings.allowReaction ?? channel.postSettings.allowReaction;

    await this.channelRepository.update(
      { id: channelId },
      { postSettings: updates },
    );
  }
}

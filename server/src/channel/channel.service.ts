import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'entities/Channel.entity';
import { Invitation } from 'entities/Invitation.entity';
import { User } from 'entities/User.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { Zone } from 'entities/Zone.entity';
import pick from 'lodash.pick';
import { UserPayload } from 'src/auth/interfaces/user.interface';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
import { CreateChannelDto } from './dto/create-channel.dto';

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
    zoneId: number,
    createChannelInfo: CreateChannelDto,
    defaultChannel = false,
  ) {
    return this.userChannelRepository
      .create({
        userId,
        channelRoleCode: 'SUPER_ADMIN',
        channel: await this.channelRepository
          .create({
            name: createChannelInfo.name,
            zoneId,
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
    userPayload: UserPayload,
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

  get userChannelBaseSelect() {
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
        'channel.public',
        'channel.zoneId',
        'createdBy.id',
        'createdBy.firstName',
        'createdBy.lastName',
        'createdBy.email',
      ]);
  }

  async getCurrentUserZoneChannels(zoneId: number, userId: number) {
    return this.userChannelBaseSelect
      .leftJoin('user_channel.channel', 'channel')
      .leftJoin('channel.createdBy', 'createdBy')
      .leftJoinAndSelect('channel.category', 'category')
      .leftJoinAndSelect('user_channel.channelRole', 'channel_role')
      .where('user_channel.userId = :userId', { userId })
      .andWhere('channel.zoneId = :zoneId', { zoneId })
      .orderBy('user_channel.createdOn', 'DESC')
      .getMany();
  }

  async getCurrentUserChannels(userId: number) {
    return this.userChannelBaseSelect
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

      .where('channel.public = true')
      .andWhere('channel.id = :channelId', { channelId })
      .andWhere('user.id <> :userId', { userId })
      .getOne();

    return channel;
  }

  async addUserToChannel(userId: number, channelId: number) {
    return this.userChannelRepository
      .create({
        userId,
        channelRoleCode: 'NORMAL',
        channelId,
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
      .leftJoin(
        UserChannel,
        'user_channel',
        'user_channel.channelId = channel.id',
      )
      .leftJoin(User, 'user', 'user.id = user_channel.userId')

      .andWhere('channel.id = :channelId', { channelId })
      .andWhere('user.email <> :email', { email })

      .getRawOne();

    return channel;
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
}

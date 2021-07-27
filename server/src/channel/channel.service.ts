import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'entities/Channel.entity';
import { UserChannelRepository } from 'entities/repositories/UserChannel.repository';
import { Zone } from 'entities/Zone.entity';
import { paginate } from 'helpers/utils';
import { UserPayload } from 'src/auth/interfaces/user.interface';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
import { PaginationQuery } from 'types/PaginationQuery';
import { CreateChannelDto } from './dto/create-channel.dto';

const { REACT_APP_CLIENT_HOST = 'http://localhost:3000' } = process.env;

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
    @InjectRepository(UserChannelRepository)
    private userChannelRepository: UserChannelRepository,
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
            categoryId: createChannelInfo.categoryId,
            createdById: userId,
            defaultChannel,
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

  async getCurrentUserZoneChannels(
    zoneId: number,
    userId: number,
    query: PaginationQuery,
  ) {
    const results = await this.userChannelRepository
      .createQueryBuilder('user_channel')
      .leftJoinAndSelect('user_channel.channel', 'channel')
      .leftJoinAndSelect('user_channel.channelRole', 'channel_role')
      .where('user_channel.userId = :userId', { userId })
      .andWhere('channel.zoneId = :zoneId', { zoneId })
      .limit(query.limit)
      .skip(query.skip)
      .getManyAndCount();

    return paginate(results, query);
  }
}

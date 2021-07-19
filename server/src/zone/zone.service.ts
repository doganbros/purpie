import { Injectable } from '@nestjs/common';
import { URL } from 'url';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQuery } from 'types/PaginationQuery';
import { Zone } from 'entities/Zone.entity';
import { Channel } from 'entities/Channel.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { UserZoneRepository } from 'entities/repositories/UserZone.repository';
import { UserPayload } from 'src/auth/interfaces/user.interface';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
import { CreateZoneDto } from './dto/create-zone.dto';

const { REACT_APP_CLIENT_HOST = 'http://localhost:3000' } = process.env;

@Injectable()
export class ZoneService {
  constructor(
    @InjectRepository(Zone) private zoneRepository: Repository<Zone>,
    @InjectRepository(UserZoneRepository)
    private userZoneRepository: UserZoneRepository,
    @InjectRepository(UserChannel)
    private userChannelRepository: Repository<UserChannel>,
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    private mailService: MailService,
  ) {}

  async createZone(
    userId: number,
    createZoneInfo: CreateZoneDto,
    defaultZone = false,
  ) {
    let userZone = this.userZoneRepository.create({
      userId,
      zoneRoleCode: 'SUPER_ADMIN',
      zone: await this.zoneRepository
        .create({
          defaultZone,
          name: createZoneInfo.name,
          subdomain: createZoneInfo.subdomain,
          description: createZoneInfo.description,
          public: createZoneInfo.public,
          createdById: userId,
          categoryId: createZoneInfo.categoryId,
        })
        .save(),
    });

    userZone = await userZone.save();

    return userZone;
  }

  async createDefaultZoneAndChannel(
    userId: number,
    createZoneInfo: CreateZoneDto,
  ) {
    const userZone = await this.createZone(userId, createZoneInfo, true);

    //  This will be pulled from the channel service when it is added
    const userChannel = this.userChannelRepository.create({
      userId,
      channelRoleCode: 'SUPER_ADMIN',
      channel: await this.channelRepository
        .create({
          zoneId: userZone.zone.id,
          name: 'default',
          defaultChannel: true,
          public: createZoneInfo.public,
          createdById: userId,
          categoryId: userZone.zone.categoryId, // This will be changed to sub category when sub categories are added
        })
        .save(),
    });

    await userChannel.save();

    return {
      userZone,
      userChannel,
    };
  }

  async userHasDefaultZoneAndChannel(userId: number) {
    const [zone, channel] = await Promise.all([
      this.zoneRepository.findOne({
        createdById: userId,
        defaultZone: true,
      }),
      this.channelRepository.findOne({
        createdById: userId,
        defaultChannel: true,
      }),
    ]);

    if (zone && channel) return true;
    return false;
  }

  async getCurrentUserZones(user: UserPayload, query: PaginationQuery) {
    return this.userZoneRepository.paginate({
      skip: query.skip,
      take: query.limit,
      relations: ['zone', 'zoneRole'],
      where: {
        userId: user.id,
      },
    });
  }

  async getUserZone(userId: number, params: Record<string, any>) {
    return this.userZoneRepository.findOne({
      where: {
        userId,
        ...params,
      },
      relations: ['zone', 'zoneRole'],
    });
  }

  async sendZoneInfoMail(zone: Zone, userPayload: UserPayload) {
    const clientUrl = new URL(REACT_APP_CLIENT_HOST);

    const context = {
      name: zone.name,
      firstName: userPayload.firstName,
      lastName: userPayload.lastName,
      link: `${clientUrl.protocol}//${zone.subdomain}.${clientUrl.host}`,
    };
    return this.mailService.sendMailByView(
      userPayload.email,
      'New Zone Created',
      'new-zone-created',
      context,
    );
  }
}

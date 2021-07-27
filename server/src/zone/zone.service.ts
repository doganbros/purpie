import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { URL } from 'url';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQuery } from 'types/PaginationQuery';
import { Zone } from 'entities/Zone.entity';
import { Channel } from 'entities/Channel.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { UserZoneRepository } from 'entities/repositories/UserZone.repository';
import { UserPayload } from 'src/auth/interfaces/user.interface';
import { ChannelService } from 'src/channel/channel.service';
import { MailService } from 'src/mail/mail.service';
import { UserZone } from 'entities/UserZone.entity';
import { Invitation } from 'entities/Invitation.entity';
import { User } from 'entities/User.entity';
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
    @InjectRepository(Invitation)
    private invitationRepository: Repository<Invitation>,
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    private mailService: MailService,
    @Inject(forwardRef(() => ChannelService))
    private channelService: ChannelService,
  ) {}

  async createZone(
    userId: number,
    createZoneInfo: CreateZoneDto,
    defaultZone = false,
  ) {
    return this.userZoneRepository
      .create({
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
      })
      .save();
  }

  async validateJoinPublicZone(userId: number, zoneId: number) {
    const zone = await this.zoneRepository
      .createQueryBuilder('zone')
      .leftJoin(UserZone, 'user_zone', 'user_zone.zoneId = zone.id')
      .leftJoin(User, 'user', 'user.id = user_zone.userId')

      .where('zone.public = true')
      .andWhere('zone.id = :zoneId', { zoneId })
      .andWhere('user.id <> :userId', { userId })
      .getOne();

    return zone;
  }

  async validateInviteUser(email: string, zoneId: number) {
    const invitation = await this.invitationRepository.findOne({
      where: { email, zoneId },
    });

    if (invitation)
      throw new BadRequestException(
        `The user with the email ${email} has already been invited to this zone`,
      );

    const zone = await this.zoneRepository
      .createQueryBuilder('zone')
      .select('user.id', 'userId')
      .leftJoin(UserZone, 'user_zone', 'user_zone.zoneId = zone.id')
      .leftJoin(User, 'user', 'user.id = user_zone.userId')

      .andWhere('zone.id = :zoneId', { zoneId })
      .andWhere('user.email <> :email', { email })

      .getRawOne();

    return zone;
  }

  async addUserToZone(userId: number, zoneId: number) {
    return this.userZoneRepository
      .create({
        userId,
        zoneRoleCode: 'NORMAL',
        zoneId,
      })
      .save();
  }

  async addUserToZoneInvitation(email: string, zoneId: number) {
    return this.invitationRepository
      .create({
        email,
        zoneId,
      })
      .save();
  }

  async validateInvitationResponse(invitationId: number, email: string) {
    return this.invitationRepository.findOne({
      where: {
        email,
        id: invitationId,
      },
    });
  }

  async createDefaultZoneAndChannel(
    userId: number,
    createZoneInfo: CreateZoneDto,
  ) {
    const userZone = await this.createZone(userId, createZoneInfo, true);

    const userChannel = await this.channelService.createChannel(
      userId,
      userZone.zone.id,
      {
        categoryId:
          userZone.zone.categoryId /* Will be changed to sub category later */,
        name: 'default',
      },
      true,
    );

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
      `New Zone '${zone.name}' Created`,
      'new-zone-created',
      context,
    );
  }

  async sendZoneInvitationMail(zone: Zone, email: string) {
    const clientUrl = new URL(REACT_APP_CLIENT_HOST);

    const context = {
      name: zone.name,
      link: `${clientUrl.protocol}//${zone.subdomain}.${clientUrl.host}/respond-to-invitation/${zone.id}`,
    };
    return this.mailService.sendMailByView(
      email,
      `Invitation To '${zone.name}' Zone`,
      'zone-invitation',
      context,
    );
  }
}

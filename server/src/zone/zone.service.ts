import { Injectable } from '@nestjs/common';
import { URL } from 'url';
import { InjectRepository } from '@nestjs/typeorm';
import { UserZonePermission } from 'entities/UserZonePermission.entity';
import { PaginationQuery } from 'types/PaginationQuery';
import { Zone } from 'entities/Zone.entity';
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
    @InjectRepository(UserZonePermission)
    private userZonePermissionRepo: Repository<UserZonePermission>,
    private mailService: MailService,
  ) {}

  async createZone(userId: number, createZoneInfo: CreateZoneDto) {
    const userZone = this.userZoneRepository.create({
      userId,
      zone: await this.zoneRepository
        .create({
          name: createZoneInfo.name,
          subdomain: createZoneInfo.subdomain,
          description: createZoneInfo.description,
          public: createZoneInfo.public,
          createdById: userId,
          adminId: userId,
        })
        .save(),
      userZonePermissions: await this.userZonePermissionRepo.create().save(),
    });

    userZone.save();

    return userZone.zone;
  }

  async getCurrentUserZones(user: UserPayload, query: PaginationQuery) {
    return this.userZoneRepository.paginate({
      skip: query.skip,
      take: query.limit,
      relations: ['zone', 'userZonePermissions'],
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
      relations: ['zone', 'userZonePermissions'],
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

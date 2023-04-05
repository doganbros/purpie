import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Zone } from 'entities/Zone.entity';
import { UserZone } from 'entities/UserZone.entity';
import { ZoneRoleCode } from '../../../types/RoleCodes';

@Injectable()
export class UserZoneService {
  constructor(
    @InjectRepository(UserZone)
    private userZoneRepository: Repository<UserZone>,
    @InjectRepository(Zone)
    private zoneRepository: Repository<Zone>,
  ) {}

  async addUserToZone(userId: string, zoneId: string) {
    return this.userZoneRepository
      .create({
        userId,
        zoneRoleCode: ZoneRoleCode.USER,
        zoneId,
      })
      .save();
  }

  async getCurrentUserZones(userId: string, subdomain: string | null = null) {
    const records = await this.zoneRepository
      .createQueryBuilder('zone')
      .select([
        'user_zone.id',
        'user_zone.createdOn',
        'zone.id',
        'zone.name',
        'zone.displayPhoto',
        'zone.subdomain',
        'zone.description',
        'zone.public',
        'createdBy.id',
        'createdBy.fullName',
        'createdBy.email',
      ])
      .leftJoin('zone.createdBy', 'createdBy')
      .leftJoin(
        UserZone,
        'user_zone',
        'user_zone.zoneId = zone.id and user_zone.userId = :userId',
        { userId },
      )
      .leftJoinAndSelect(
        'user_zone.zoneRole',
        'zone_role',
        'zone_role.zoneId = zone.id AND zone_role.roleCode = user_zone.zoneRoleCode',
      )
      .where('zone.public = true and zone.subdomain = :subdomain', {
        subdomain,
      })
      .orWhere('user_zone.userId = :userId', { userId })
      .orderBy('user_zone.createdOn', 'DESC')
      .getRawMany();

    return records.map((record) => ({
      id: record.user_zone_id,
      createdOn: record.user_zone_createdOn,
      zone: {
        id: record.zone_id,
        name: record.zone_name,
        subdomain: record.zone_subdomain,
        displayPhoto: record.zone_displayPhoto,
        description: record.zone_description,
        public: record.zone_public,
        createdBy: {
          id: record.createdBy_id,
          fullName: record.createdBy_fullName,
          email: record.createdBy_email,
        },
      },
      zoneRole: {
        roleCode: record.zone_role_roleCode,
        zoneId: record.zone_role_zoneId,
        roleName: record.zone_role_roleName,
        canCreateChannel: record.zone_role_canCreateChannel,
        canInvite: record.zone_role_canInvite,
        canDelete: record.zone_role_canDelete,
        canEdit: record.zone_role_canEdit,
        canManageRole: record.zone_role_canManageRole,
      },
    }));
  }

  async getUserZone(userId: number, params: Record<string, any>) {
    const baseQuery = this.userZoneRepository
      .createQueryBuilder('user_zone')
      .select(['user_zone.id', 'user_zone.createdOn'])
      .innerJoinAndSelect('user_zone.zone', 'zone')
      .innerJoinAndSelect(
        'user_zone.zoneRole',
        'zoneRole',
        'zoneRole.zoneId = zone.id AND zoneRole.roleCode = user_zone.zoneRoleCode',
      )
      .where('user_zone.userId = :userId', { userId });

    if (params.zoneId)
      baseQuery.andWhere('zone.id = :zoneId', { zoneId: params.zoneId });
    if (params.userZoneId)
      baseQuery.andWhere('user_zone.id = :userZoneId', {
        userZoneId: params.userZoneId,
      });

    return baseQuery.getOne();
  }

  async userExistsInZone(userId: string, zoneId: string) {
    return this.userZoneRepository.findOne({ where: { userId, zoneId } });
  }
}

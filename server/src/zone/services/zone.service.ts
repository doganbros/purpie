import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { pick } from 'lodash';
import { URL } from 'url';
import { Brackets, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Zone } from 'entities/Zone.entity';
import { defaultZoneRoles } from 'entities/data/default-roles';
import { tsqueryParam } from 'helpers/utils';
import { SearchQuery } from 'types/SearchQuery';
import { ZoneRole } from 'entities/ZoneRole.entity';
import { UserProfile } from 'src/auth/interfaces/user.interface';
import { MailService } from 'src/mail/mail.service';
import { SystemUserListQuery } from 'src/user/dto/system-user-list.query';
import { UserZone } from 'entities/UserZone.entity';
import { Invitation } from 'entities/Invitation.entity';
import { User } from 'entities/User.entity';
import { CreateZoneDto } from '../dto/create-zone.dto';
import { EditZoneDto } from '../dto/edit-zone.dto';
import { UpdateUserZoneRoleDto } from '../dto/update-user-zone-role.dto';
import { UpdateZonePermission } from '../dto/update-zone-permission.dto';
import { ErrorTypes } from '../../../types/ErrorTypes';
import { UserChannel } from '../../../entities/UserChannel.entity';

const { REACT_APP_CLIENT_HOST = 'http://localhost:3000' } = process.env;

@Injectable()
export class ZoneService {
  constructor(
    @InjectRepository(Zone) private zoneRepository: Repository<Zone>,
    @InjectRepository(ZoneRole)
    private zoneRoleRepository: Repository<ZoneRole>,
    @InjectRepository(UserZone)
    private userZoneRepository: Repository<UserZone>,
    @InjectRepository(Invitation)
    private invitationRepository: Repository<Invitation>,
    private mailService: MailService,
  ) {}

  async createZone(userId: number, createZoneInfo: CreateZoneDto) {
    const userZone = await this.userZoneRepository
      .create({
        userId,
        zoneRoleCode: 'SUPER_ADMIN',
        zone: await this.zoneRepository
          .create({
            name: createZoneInfo.name,
            subdomain: createZoneInfo.subdomain,
            description: createZoneInfo.description,
            public: createZoneInfo.public,
            createdById: userId,
          })
          .save(),
      })
      .save();

    await this.zoneRoleRepository.insert(
      defaultZoneRoles.map((v) => ({ ...v, zoneId: userZone.zone.id })),
    );

    return userZone;
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
        ErrorTypes.USER_ALREADY_INVITED_TO_ZONE,
        `The user with the email ${email} has already been invited to this zone`,
      );

    const zone = await this.zoneRepository
      .createQueryBuilder('zone')
      .select('user.id', 'userId')
      .innerJoin(UserZone, 'user_zone', 'user_zone.zoneId = zone.id')
      .innerJoin(User, 'user', 'user.id = user_zone.userId')
      .where('user.email = :email', { email })
      .getRawOne();

    if (zone)
      throw new BadRequestException(
        ErrorTypes.USER_ALREADY_MEMBER_OF_ZONE,
        `The user with the email ${email} is already a member of this zone`,
      );
  }

  async addUserToZoneInvitation(email: string, zoneId: number, userId: number) {
    return this.invitationRepository
      .create({
        email,
        zoneId,
        createdById: userId,
      })
      .save();
  }

  async removeInvitation(email: string, zoneId: number) {
    return this.invitationRepository.delete({ email, zoneId });
  }

  async validateInvitationResponse(invitationId: number, email: string) {
    return this.invitationRepository.findOne({
      where: {
        email,
        id: invitationId,
      },
    });
  }

  async searchZone(userId: number, query: SearchQuery) {
    return this.zoneRepository
      .createQueryBuilder('zone')
      .select([
        'zone.id',
        'zone.createdOn',
        'zone.name',
        'zone.displayPhoto',
        'zone.subdomain',
        'zone.description',
        'zone.public',
      ])
      .addSelect(
        `ts_rank(zone.search_document, to_tsquery('simple', :searchTerm))`,
        'search_rank',
      )
      .leftJoin(
        UserZone,
        'user_zone',
        'zone.id = user_zone.zoneId and user_zone.userId = :userId',
        { userId },
      )
      .setParameter('searchTerm', tsqueryParam(query.searchTerm))
      .where(
        new Brackets((qb) => {
          qb.where('zone.public = true').orWhere('user_zone.id is not null');
        }),
      )
      .andWhere(`zone.search_document @@ to_tsquery('simple', :searchTerm)`)
      .orderBy('search_rank', 'DESC')
      .paginate(query);
  }

  async sendZoneInfoMail(zone: Zone, userPayload: UserProfile) {
    const clientUrl = new URL(REACT_APP_CLIENT_HOST);

    const context = {
      name: zone.name,
      fullName: userPayload.fullName,
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
      link: `${clientUrl.protocol}//${clientUrl.host}/respond-to-invitation/zone/${zone.id}`,
    };
    return this.mailService.sendMailByView(
      email,
      `Invitation To '${zone.name}' Zone`,
      'zone-invitation',
      context,
    );
  }

  async deleteZoneById(id: number) {
    return this.zoneRepository.delete({ id });
  }

  async changeDisplayPhoto(zoneId: number, fileName: string) {
    return this.zoneRepository.update(
      { id: zoneId },
      { displayPhoto: fileName },
    );
  }

  async editZoneById(id: number, editInfo: EditZoneDto) {
    return this.zoneRepository.update(
      { id },
      pick(editInfo, ['name', 'description', 'subdomain', 'public']),
    );
  }

  listZoneRoles(zoneId: number) {
    return this.zoneRoleRepository.find({ take: 30, where: { zoneId } });
  }

  listZoneUsers(zoneId: number, query: SystemUserListQuery) {
    const baseQuery = this.userZoneRepository
      .createQueryBuilder('userZone')
      .select([
        'userZone.id',
        'userZone.createdOn',
        'user.id',
        'user.fullName',
        'user.email',
        'user.userName',
        'user.displayPhoto',
      ])
      .innerJoin('userZone.user', 'user')
      .leftJoinAndSelect(
        'userZone.zoneRole',
        'zoneRole',
        'zoneRole.roleCode = userZone.zoneRoleCode AND zoneRole.zoneId = :zoneId',
        { zoneId },
      )
      .where('userZone.zoneId = :zoneId', { zoneId });

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
      baseQuery.orderBy('user.fullName');
    }

    return baseQuery.paginate(query);
  }

  async changeUserZoneRole(zoneId: number, info: UpdateUserZoneRoleDto) {
    const { zoneRoleCode } = info;
    if (zoneRoleCode !== 'SUPER_ADMIN') {
      const remainingSuperAdminCount = await this.userZoneRepository.count({
        where: {
          userId: Not(info.userId),
          zoneId,
          zoneRoleCode: 'SUPER_ADMIN',
        },
      });

      if (remainingSuperAdminCount === 0)
        throw new ForbiddenException(
          ErrorTypes.SUPER_ADMIN_NOT_EXIST,
          'There must be at least one super admin',
        );
    }

    return this.userZoneRepository.update(
      { userId: info.userId, zoneId },
      {
        zoneRoleCode: info.zoneRoleCode as any,
      },
    );
  }

  async createZoneRole(zoneId: number, info: ZoneRole) {
    const existingRoleCodes = await this.zoneRoleRepository.count({
      where: { roleCode: info.roleCode, zoneId },
    });

    if (existingRoleCodes)
      throw new BadRequestException(
        ErrorTypes.ROLE_ALREADY_EXISTS,
        `The role code ${info.roleCode} already exists`,
      );

    return this.zoneRoleRepository.create({ ...info, zoneId }).save();
  }

  async removeZoneRole(zoneId: number, roleCode: string) {
    const existing = await this.userZoneRepository.count({
      where: { zoneRoleCode: roleCode, zoneId },
    });

    if (existing)
      throw new ForbiddenException(
        ErrorTypes.USER_ROLE_EXIST,
        'Users using this role already exists',
      );

    return this.zoneRoleRepository
      .delete({ roleCode, isSystemRole: false, zoneId })
      .then((res) => res.affected);
  }

  async editZoneRolePermissions(
    zoneId: number,
    roleCode: any,
    info: Partial<UpdateZonePermission>,
  ) {
    if (roleCode === 'SUPER_ADMIN')
      throw new ForbiddenException(
        ErrorTypes.CHANGE_SUPER_ADMIN_PERMISSION,
        "Super Admin Permissions can't be changed",
      );

    const updates: Partial<UpdateZonePermission> = {};

    const fields = [
      'canInvite',
      'canDelete',
      'canEdit',
      'canCreateChannel',
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

    return this.zoneRoleRepository.update({ roleCode, zoneId }, updates);
  }
}

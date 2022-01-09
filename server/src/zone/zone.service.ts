import { BadRequestException, Injectable } from '@nestjs/common';
import { pick } from 'lodash';
import { URL } from 'url';
import { Brackets, IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Zone } from 'entities/Zone.entity';
import { UserZoneRepository } from 'entities/repositories/UserZone.repository';
import { tsqueryParam } from 'helpers/utils';
import { SearchQuery } from 'types/SearchQuery';
import { UserPayload } from 'src/auth/interfaces/user.interface';
import { Category } from 'entities/Category.entity';
import { MailService } from 'src/mail/mail.service';
import { UserZone } from 'entities/UserZone.entity';
import { Invitation } from 'entities/Invitation.entity';
import { User } from 'entities/User.entity';
import { CreateZoneDto } from './dto/create-zone.dto';
import { EditZoneDto } from './dto/edit-zone.dto';

const { REACT_APP_CLIENT_HOST = 'http://localhost:3000' } = process.env;

@Injectable()
export class ZoneService {
  constructor(
    @InjectRepository(Zone) private zoneRepository: Repository<Zone>,
    @InjectRepository(UserZoneRepository)
    private userZoneRepository: UserZoneRepository,
    @InjectRepository(Invitation)
    private invitationRepository: Repository<Invitation>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private mailService: MailService,
  ) {}

  async createZone(userId: number, createZoneInfo: CreateZoneDto) {
    return this.userZoneRepository
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
        'USER_ALREADY_INVITED_TO_ZONE',
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

  async searchZone(userPayload: UserPayload, query: SearchQuery) {
    return this.zoneRepository
      .createQueryBuilder('zone')
      .select([
        'zone.id',
        'zone.createdOn',
        'zone.name',
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
        { userId: userPayload.id },
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

  async getCurrentUserZones(
    user: UserPayload,
    subdomain: string | null = null,
  ) {
    const records = await this.zoneRepository
      .createQueryBuilder('zone')
      .select([
        'user_zone.id',
        'user_zone.createdOn',
        'zone.id',
        'zone.name',
        'zone.subdomain',
        'zone.description',
        'zone.public',
        'createdBy.id',
        'createdBy.firstName',
        'createdBy.lastName',
        'createdBy.email',
      ])
      .leftJoin('zone.createdBy', 'createdBy')
      .leftJoinAndSelect('zone.category', 'category')
      .leftJoin(
        UserZone,
        'user_zone',
        'user_zone.zoneId = zone.id and user_zone.userId = :userId',
        { userId: user.id },
      )
      .leftJoinAndSelect('user_zone.zoneRole', 'zone_role')
      .where('zone.public = true and zone.subdomain = :subdomain', {
        subdomain,
      })
      .orWhere('user_zone.userId = :userId', { userId: user.id })
      .orderBy('user_zone.createdOn', 'DESC')
      .getRawMany();

    return records.map((record) => ({
      id: record.user_zone_id,
      createdOn: record.user_zone_createdOn,
      zone: {
        id: record.zone_id,
        name: record.zone_name,
        subdomain: record.zone_subdomain,
        description: record.zone_description,
        public: record.zone_public,
        category: {
          id: record.category_id,
          name: record.category_name,
          parentCategoryId: record.category_parentCategoryId,
        },
        createdBy: {
          id: record.createdBy_id,
          firstName: record.createdBy_firstName,
          lastName: record.createdBy_lastName,
          email: record.createdBy_email,
        },
      },
      zoneRole: {
        roleCode: record.zone_role_roleCode,
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
    return this.userZoneRepository.findOne({
      where: {
        userId,
        ...params,
      },
      relations: ['zone', 'zoneRole', 'zone.category'],
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

  async getCategories(parentCategoryId?: number) {
    return this.categoryRepository.find({
      where: { parentCategoryId: parentCategoryId ?? IsNull() },
    });
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

  async userExistsInZone(userId: number, zoneId: number) {
    return this.userZoneRepository.findOne({ where: { userId, zoneId } });
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
}

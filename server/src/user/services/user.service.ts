import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from 'entities/Contact.entity';
import { AuthService } from 'src/auth/services/auth.service';
import { generateLowerAlphaNumId, tsqueryParam } from 'helpers/utils';
import { BlockedUser } from 'entities/BlockedUser.entity';
import { UserRole } from 'entities/UserRole.entity';
import { Invitation } from 'entities/Invitation.entity';
import { UserZone } from 'entities/UserZone.entity';
import { PostSettings } from 'types/PostSettings';
import { User } from 'entities/User.entity';
import { FeaturedPost } from 'entities/FeaturedPost.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { Brackets, In, Not, Repository } from 'typeorm';
import { PaginationQuery } from 'types/PaginationQuery';
import { SearchUsersQuery } from '../dto/search-users.query';
import { SetUserRoleDto } from '../dto/set-user-role.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UpdateUserPermission } from '../dto/update-permissions.dto';
import { SystemUserListQuery } from '../dto/system-user-list.query';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    @InjectRepository(FeaturedPost)
    private featuredPostRepository: Repository<FeaturedPost>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @InjectRepository(UserChannel)
    private userChannelRepository: Repository<UserChannel>,
    @InjectRepository(UserZone)
    private userZoneRepository: Repository<UserZone>,
    @InjectRepository(Invitation)
    private invitationRepository: Repository<Invitation>,
    @InjectRepository(BlockedUser)
    private blockedUserRepository: Repository<BlockedUser>,
    private authService: AuthService,
  ) {}

  async createNewContact(userId: number, contactUserId: number) {
    if (userId === contactUserId)
      throw new BadRequestException(
        'You cannot add yourself to your contacts',
        'CONTACT_ELIGEBILITY_ERR',
      );

    await this.contactRepository.insert({ userId, contactUserId }).catch(() => {
      // Ignore duplicate insertion error
      // So that if it exists in other user's contact it will just use that
    });
    await this.contactRepository
      .insert({ userId: contactUserId, contactUserId: userId })
      .catch(() => {
        // Ignore duplicate insertion error
        // So that if it exists in other user's contact it will just use that
      });

    return true;
  }

  userBaseSelect(excludeUserIds: Array<number>, query: SearchUsersQuery) {
    return this.userRepository
      .createQueryBuilder('user')
      .setParameter('searchTerm', tsqueryParam(query.name))
      .select([
        'user.id',
        'user.fullName',
        'user.email',
        'user.userName',
        'user.displayPhoto',
      ])
      .addSelect(
        `ts_rank(user.search_document, to_tsquery('simple', :searchTerm))`,
        'search_rank',
      )
      .where(`user.search_document @@ to_tsquery('simple', :searchTerm)`)
      .andWhere('user.id not IN (:...excludeUserIds)', { excludeUserIds })
      .orderBy('search_rank', 'DESC');
  }

  async searchUsers(excludeUserIds: Array<number>, query: SearchUsersQuery) {
    return this.userBaseSelect(excludeUserIds, query).paginate(query);
  }

  async searchInUserContacts(
    userId: number,
    excludeUserIds: Array<number>,
    query: SearchUsersQuery,
  ) {
    return this.userBaseSelect(excludeUserIds, query)
      .innerJoin(Contact, 'contact', 'contact.userId = :userId', { userId })
      .andWhere('user.id = contact.contactUserId')
      .paginate(query);
  }

  async searchInChannels(
    channelId: number,
    excludeUserIds: Array<number>,
    query: SearchUsersQuery,
  ) {
    return this.userBaseSelect(excludeUserIds, query)
      .innerJoin(
        UserChannel,
        'user_channel',
        'user_channel.channelId = :channelId',
        { channelId },
      )
      .andWhere('user_channel.userId = user.id')
      .paginate(query);
  }

  async createNewContactInvitation(email: string, createdById: number) {
    const existing = await this.invitationRepository
      .createQueryBuilder('invitation')
      .innerJoin('invitation.createdBy', 'createdBy')
      .innerJoin('invitation.invitee', 'invitee')
      .select(['invitation.id', 'invitation.createdById', 'invitation.email'])
      .where(
        new Brackets((qb) => {
          qb.where('createdBy.email = :email', {
            email,
          }).andWhere('invitee.id = :createdById', {
            createdById,
          });
        }),
      )
      .orWhere(
        new Brackets((qb) => {
          qb.where('invitee.email = :email', {
            email,
          }).andWhere('createdBy.id = :createdById', {
            createdById,
          });
        }),
      )
      .getOne();

    if (existing?.email === email)
      throw new BadRequestException(
        'Invitation to this user has already been sent',
        'INVITATION_FOR_USER_ALREADY_SENT',
      );
    else if (existing)
      throw new BadRequestException(
        'You have already been invited by this user already',
        'INVITATION_RECEIVED_FROM_USER_ALREADY',
      );

    return this.invitationRepository
      .create({
        createdById,
        email,
      })
      .save();
  }

  listContactInvitations(userId: number, query: PaginationQuery) {
    return this.invitationRepository
      .createQueryBuilder('contact_invitation')
      .innerJoin('contact_invitation.createdBy', 'inviter')
      .innerJoin('contact_invitation.invitee', 'invitee')
      .select([
        'contact_invitation.id',
        'contact_invitation.createdOn',
        'inviter.id',
        'inviter.email',
        'inviter.fullName',
        'inviter.displayPhoto',
        'inviter.userName',
      ])
      .where('contact_invitation.zoneId is null')
      .andWhere('contact_invitation.channelId is null')
      .andWhere('invitee.id = :userId', { userId })
      .paginate(query);
  }

  getContactInvitationByIdAndInviteeId(id: number, inviteeId: number) {
    return this.invitationRepository
      .createQueryBuilder('invitation')
      .innerJoin('invitation.createdBy', 'inviter')
      .innerJoin('invitation.invitee', 'invitee')
      .select([
        'invitation.id',
        'inviter.id',
        'invitee.id',
        'invitation.createdById',
      ])
      .where('invitation.id = :id', { id })
      .andWhere('invitee.id = :inviteeId', { inviteeId })
      .andWhere('invitation.channelId is null')
      .andWhere('invitation.zoneId is null')
      .getOne();
  }

  async listInvitationsForUser(userId: number, query: PaginationQuery) {
    return this.invitationRepository
      .createQueryBuilder('invitation')
      .innerJoin('invitation.createdBy', 'inviter')
      .innerJoin('invitation.invitee', 'invitee')
      .leftJoin('invitation.zone', 'zone')
      .leftJoin('invitation.channel', 'channel')
      .leftJoin('channel.zone', 'channel_zone')
      .select([
        'invitation.id',
        'invitation.createdOn',
        'inviter.id',
        'inviter.email',
        'inviter.fullName',
        'inviter.displayPhoto',
        'inviter.userName',
        'zone.id',
        'zone.createdOn',
        'zone.name',
        'zone.displayPhoto',
        'zone.subdomain',
        'zone.description',
        'zone.public',
        'channel.id',
        'channel.createdOn',
        'channel.name',
        'channel.displayPhoto',
        'channel.topic',
        'channel.description',
        'channel.public',
        'channel_zone.id',
        'channel_zone.createdOn',
        'channel_zone.name',
        'channel_zone.displayPhoto',
        'channel_zone.subdomain',
        'channel_zone.description',
        'channel_zone.public',
      ])
      .where('invitee.id = :userId', { userId })
      .paginate(query);
  }

  async removeContactInvitation(id: number) {
    return this.invitationRepository.delete(id);
  }

  listContacts(identity: number | string, query: PaginationQuery) {
    const baseQuery = this.contactRepository
      .createQueryBuilder('contact')
      .select([
        'contact.id',
        'contact.createdOn',
        'contactUser.id',
        'contactUser.userName',
        'contactUser.email',
        'contactUser.fullName',
        'contactUser.displayPhoto',
      ])
      .innerJoin('contact.contactUser', 'contactUser');

    if (typeof identity === 'number')
      baseQuery.where('contact.userId = :identity', { identity });
    else
      baseQuery
        .innerJoin('contact.user', 'user')
        .where('user.userName = :identity', { identity });

    return baseQuery.paginate(query);
  }

  async deleteContact(userId: number, id: number) {
    return this.contactRepository
      .createQueryBuilder()
      .delete()
      .where('userId = :userId AND id = :id', {
        userId,
        id,
      })
      .execute();
  }

  listUserRoles() {
    return this.userRoleRepository.find({ take: 30 });
  }

  async getPublicUserProfile(currentUserId: number, userName: string) {
    const result = await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.fullName',
        'user.userName',
        'user.displayPhoto',
        'user.email',
      ])
      .addSelect((subQuery) => {
        return subQuery
          .select('count(*) > 0', 'userCount')
          .from(Contact, 'contact')
          .where('contact.contactUserId = user.id')
          .andWhere('contact.userId = :currentUserId', { currentUserId });
      }, 'isInContact')
      .addSelect((subQuery) => {
        return subQuery
          .select('count(*) > 0', 'blockedCount')
          .from(BlockedUser, 'blocked_user')
          .where('blocked_user.userId = :currentUserId', { currentUserId })
          .andWhere('blocked_user.createdById = user.id');
      }, 'isBlocked')
      .where('user.userName = :userName', { userName })
      .getRawOne();

    if (!result)
      throw new NotFoundException('User not found', 'USER_NOT_FOUND');

    if (result.isBlocked)
      throw new ForbiddenException('User has blocked you', 'USER_BLOCKED_YOU');

    return {
      id: result.user_id,
      fullName: result.user_fullName,
      userName: result.user_userName,
      displayPhoto: result.user_displayPhoto,
      email: result.user_email,
      isInContact: result.isInContact,
    };
  }

  listSystemUsers(query: SystemUserListQuery) {
    const baseQuery = this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.fullName',
        'user.email',
        'user.userName',
        'user.userRoleCode',
        'user.displayPhoto',
      ])
      .leftJoinAndSelect('user.userRole', 'userRole');

    if (query.name) {
      baseQuery
        .setParameter('searchTerm', tsqueryParam(query.name))
        .addSelect(
          `ts_rank(user.search_document, to_tsquery('simple', :searchTerm))`,
          'search_rank',
        )
        .where(`user.search_document @@ to_tsquery('simple', :searchTerm)`)
        .orderBy('search_rank', 'DESC');
    } else {
      baseQuery.orderBy('user.fullName');
    }

    return baseQuery.paginate(query);
  }

  async changeUserRole(info: SetUserRoleDto) {
    const { roleCode } = info;
    if (roleCode !== 'SUPER_ADMIN') {
      const remainingSuperAdminCount = await this.userRepository.count({
        where: { id: Not(info.userId), userRoleCode: 'SUPER_ADMIN' },
      });

      if (remainingSuperAdminCount === 0)
        throw new ForbiddenException('There must be at least one super admin');
    }

    return this.userRepository.update(info.userId, {
      userRoleCode: info.roleCode,
    });
  }

  async createUserRole(info: UserRole) {
    const existingRoleCodes = await this.userRoleRepository.count({
      where: { roleCode: info.roleCode },
    });

    if (existingRoleCodes)
      throw new BadRequestException(
        `The role code ${info.roleCode} already exists`,
        'ROLE_CODE_ALREADY_EXISTS',
      );

    return this.userRoleRepository.create(info).save();
  }

  async removeUserRole(roleCode: any) {
    const existing = await this.userRepository.count({
      where: { userRoleCode: roleCode },
    });

    if (existing)
      throw new ForbiddenException(
        'Users using this role already exists',
        'USERS_USING_ROLE',
      );

    return this.userRoleRepository
      .delete({ roleCode, isSystemRole: false })
      .then((res) => res.affected);
  }

  async editUserRolePermissions(
    roleCode: any,
    info: Partial<UpdateUserPermission>,
  ) {
    if (roleCode === 'SUPER_ADMIN')
      throw new ForbiddenException("Super Admin Permissions can't be changed");

    const updates: Partial<UpdateUserPermission> = {};

    const fields = [
      'canCreateZone',
      'canCreateClient',
      'canManageRole',
    ] as const;

    fields.forEach((v) => {
      if (info[v] !== undefined) updates[v] = info[v];
    });

    if (!Object.keys(updates).length)
      throw new BadRequestException(
        'Fields for updates not specified',
        'FIELDS_FOR_UPDATES_NOT_SPECIFIED',
      );

    return this.userRoleRepository.update({ roleCode }, updates);
  }

  async userNameExists(userName: string) {
    return this.userRepository.findOne({ where: { userName }, select: ['id'] });
  }

  async changeDisplayPhoto(userId: number, fileName: string) {
    return this.userRepository.update(
      { id: userId },
      { displayPhoto: fileName },
    );
  }

  async updateProfile(userId: number, payload: UpdateProfileDto) {
    const userProfile = await this.authService.getUserProfile(userId);

    if (!userProfile)
      throw new NotFoundException(
        'User profile not found',
        'USER_PROFILE_NOT_FOUND',
      );

    const updates: Record<string, any> = {};

    if (payload.fullName && payload.fullName !== userProfile.fullName) {
      updates.fullName = payload.fullName;
    }
    if (payload.userName && payload.userName !== userProfile.userName) {
      updates.userName = payload.userName;
    }

    if (!Object.keys(updates).length)
      throw new BadRequestException(
        'No Changes detected',
        'NO_CHANGES_DETECTED',
      );

    await this.userRepository.update({ id: userId }, updates);
  }

  async userNameSuggestions(userName: string) {
    const { length } = userName;

    const slicedIndex = Math.floor(length / 2) + 1;

    const suggestions = [
      `${userName}_`,
      `${userName}1`,
      `${userName}_1`,
      `${userName}2`,
      `${userName.slice(0, slicedIndex)}_${userName.slice(slicedIndex)}`,
      `${userName.slice(0, slicedIndex)}_${userName.slice(slicedIndex)}_`,
      `${userName}_${generateLowerAlphaNumId()}`,
    ];

    const result = await this.userRepository
      .find({
        select: ['userName'],
        where: { userName: In(suggestions) },
      })
      .then((users) => users.map((u) => u.userName));

    return suggestions.filter((v) => !result.includes(v));
  }

  getUserChannels(userId: number, userName: string, query: PaginationQuery) {
    return this.userChannelRepository
      .createQueryBuilder('user_channel')
      .select('user_channel.id')
      .addSelect([
        'channel.id',
        'channel.createdOn',
        'channel.name',
        'channel.topic',
        'channel.displayPhoto',
        'channel.description',
        'channel.public',
        'channel.zoneId',
      ])
      .innerJoin('user_channel.channel', 'channel')
      .innerJoin('user_channel.user', 'user')
      .where('user.userName = :userName', { userName })
      .andWhere(
        new Brackets((qb) => {
          const userQb = this.userChannelRepository
            .createQueryBuilder('user_channel_user')
            .select('user_channel_user.id')
            .where('user_channel_user.userId = :userId');

          qb.where(
            'channel.public = true',
          ).orWhere(`EXISTS (${userQb.getQuery()})`, { userId });
        }),
      )
      .paginate(query);
  }

  getUserZones(userId: number, userName: string, query: PaginationQuery) {
    return this.userZoneRepository
      .createQueryBuilder('user_zone')
      .select('user_zone.id')
      .addSelect([
        'zone.id',
        'zone.subdomain',
        'zone.name',
        'category.id',
        'category.name',
        'zone.createdOn',
        'zone.displayPhoto',
        'zone.description',
        'zone.public',
      ])
      .innerJoin('user_zone.zone', 'zone')
      .innerJoin('zone.category', 'category')
      .innerJoin('user_zone.user', 'user')
      .where('user.userName = :userName', { userName })
      .andWhere(
        new Brackets((qb) => {
          const userQb = this.userZoneRepository
            .createQueryBuilder('user_zone_user')
            .select('user_zone_user.id')
            .where('user_zone_user.userId = :userId');

          qb.where(
            'zone.public = true',
          ).orWhere(`EXISTS (${userQb.getQuery()})`, { userId });
        }),
      )
      .paginate(query);
  }

  getBlockedUsers(userId: number, query: PaginationQuery) {
    return this.blockedUserRepository
      .createQueryBuilder('blocked_user')
      .innerJoin('blocked_user.user', 'user')
      .select([
        'blocked_user.id',
        'blocked_user.createdOn',
        'user.id',
        'user.fullName',
        'user.email',
        'user.userName',
        'user.userRoleCode',
        'user.displayPhoto',
      ])
      .where('blocked_user.createdById = :userId', { userId })
      .paginate(query);
  }

  async createBlockedUser(createdById: number, userId: number) {
    if (createdById === userId)
      throw new BadRequestException(
        'You cannot block yourself',
        'YOU_CANT_BLOCK_YOURSELF',
      );

    const [createdBy, user] = await Promise.all([
      this.userRepository.findOne({
        where: { id: createdById },
        select: ['id', 'email'],
      }),
      this.userRepository.findOne({
        where: { id: userId },
        select: ['id', 'email'],
      }),
    ]);

    if (!(user && createdBy))
      throw new NotFoundException('User not found', 'USER_NOT_FOUND');

    await this.blockedUserRepository.create({ createdById, userId }).save();

    await this.invitationRepository
      .createQueryBuilder()
      .delete()
      .where('email = :userEmail and createdById = :createdById', {
        createdById,
        userEmail: user.email,
      })
      .orWhere('email = :createdByEmail and createdById = :userId', {
        userId,
        createdByEmail: createdBy.email,
      })
      .execute();
    await this.contactRepository
      .createQueryBuilder()
      .delete()
      .where('contactUserId = :createdById and userId = :userId', {
        createdById,
        userId,
      })
      .orWhere('contactUserId = :userId and userId = :createdById', {
        createdById,
        userId,
      })
      .execute();
  }

  async unBlockUser(createdById: number, userId: number) {
    if (createdById === userId)
      throw new BadRequestException(
        'You cannot unblock yourself',
        'YOU_CANT_UNBLOCK_YOURSELF',
      );
    await this.blockedUserRepository.delete({ createdById, userId });
  }

  getPostSettings(userId: number) {
    return this.userRepository
      .findOne({
        where: { id: userId },
        select: ['postSettings'],
      })
      .then((res) => res?.postSettings);
  }

  async updatePostSettings(userId: number, settings: PostSettings) {
    const updates: Partial<PostSettings> = {};

    const user = await this.userRepository.findOne(userId, {
      select: ['postSettings'],
    });

    if (!user)
      throw new NotFoundException('Channel not found', 'CHANNEL_NOT_FOUND');

    updates.allowComment =
      settings.allowComment ?? user.postSettings.allowComment;
    updates.allowDislike =
      settings.allowDislike ?? user.postSettings.allowDislike;
    updates.allowReaction =
      settings.allowReaction ?? user.postSettings.allowReaction;

    await this.userRepository.update({ id: userId }, { postSettings: updates });
  }

  async setFeaturedPost(userId: number, postId: number) {
    const hasFeaturedPost = await this.featuredPostRepository.count({
      where: { userId, postId },
    });

    if (hasFeaturedPost) {
      return this.featuredPostRepository.update({ userId }, { postId });
    }

    return this.featuredPostRepository.create({ userId, postId }).save();
  }

  async removeFeaturedPost(userId: number) {
    return this.featuredPostRepository.delete({ userId });
  }
}

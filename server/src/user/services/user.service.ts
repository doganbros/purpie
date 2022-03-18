import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from 'entities/Contact.entity';
import { MattermostService } from 'src/utils/services/mattermost.service';
import { ContactInvitation } from 'entities/ContactInvitation.entity';
import { AuthService } from 'src/auth/services/auth.service';
import { generateLowerAlphaNumId, tsqueryParam } from 'helpers/utils';
import { UserRole } from 'entities/UserRole.entity';
import { User } from 'entities/User.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { In, Not, Repository } from 'typeorm';
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
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @InjectRepository(ContactInvitation)
    private contactInvitation: Repository<ContactInvitation>,
    private authService: AuthService,
    private readonly mattermostService: MattermostService,
  ) {}

  createNewContact(userId: number, contactUserId: number) {
    if (userId === contactUserId)
      throw new BadRequestException(
        'You cannot add yourself to your contacts',
        'CONTACT_ELIGEBILITY_ERR',
      );

    return this.contactRepository.insert([
      { userId, contactUserId },
      { userId: contactUserId, contactUserId: userId },
    ]);
  }

  userBaseSelect(excludeUserIds: Array<number>, query: SearchUsersQuery) {
    return this.userRepository
      .createQueryBuilder('user')
      .setParameter('searchTerm', tsqueryParam(query.name))
      .select([
        'user.id',
        'user.firstName',
        'user.lastName',
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

  async createNewContactInvitation(inviterId: number, inviteeId: number) {
    if (inviterId === inviteeId)
      throw new BadRequestException(
        'Inviter and Invitee cannot be the same user',
        'INVITER_INVITEE_EQUALITY_ERR',
      );

    return this.contactInvitation
      .create({
        inviteeId,
        inviterId,
      })
      .save();
  }

  listContactInvitations(userId: number, query: PaginationQuery) {
    return this.contactInvitation
      .createQueryBuilder('contact_invitation')
      .innerJoinAndSelect('contact_invitation.inviter', 'inviter')
      .select([
        'contact_invitation.id',
        'contact_invitation.createdOn',
        'inviter.id',
        'inviter.email',
        'inviter.firstName',
        'inviter.lastName',
        'inviter.displayPhoto',
        'inviter.userName',
      ])
      .where('contact_invitation.inviteeId = :userId', {
        userId,
      })
      .paginate(query);
  }

  getContactInvitationByIdAndInviteeId(id: number, inviteeId: number) {
    return this.contactInvitation.findOne({ id, inviteeId });
  }

  async removeContactInvitation(id: number) {
    return this.contactInvitation.delete(id);
  }

  listContacts(userId: number, query: PaginationQuery) {
    return this.contactRepository
      .createQueryBuilder('contact')
      .innerJoinAndSelect('contact.contactUser', 'contactUser')
      .select([
        'contact.id',
        'contact.createdOn',
        'contactUser.id',
        'contactUser.userName',
        'contactUser.email',
        'contactUser.firstName',
        'contactUser.lastName',
        'contactUser.displayPhoto',
      ])
      .where('contact.userId = :userId', {
        userId,
      })
      .paginate(query);
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
        'user.firstName',
        'user.lastName',
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
      .where('user.userName = :userName', { userName })
      .getRawOne();

    if (!result)
      throw new NotFoundException('User not found', 'USER_NOT_FOUND');

    return {
      id: result.user_id,
      firstName: result.user_firstName,
      lastName: result.user_lastName,
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
        'user.firstName',
        'user.lastName',
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
      baseQuery.orderBy('user.firstName').addOrderBy('user.lastName');
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

    if (payload.firstName && payload.firstName !== userProfile.firstName) {
      updates.firstName = payload.firstName;
    }
    if (payload.lastName && payload.lastName !== userProfile.lastName) {
      updates.lastName = payload.lastName;
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

    const mattermostUpdates: any = { id: userProfile.mattermostId };

    if (updates.firstName) mattermostUpdates.first_name = updates.firstName;
    if (updates.lastName) mattermostUpdates.last_name = updates.lastName;
    if (updates.userName) mattermostUpdates.username = updates.userName;

    await this.mattermostService.mattermostClient.patchUser(mattermostUpdates);
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
}

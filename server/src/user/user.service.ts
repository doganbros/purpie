import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from 'entities/Contact.entity';
import { ContactInvitation } from 'entities/ContactInvitation.entity';
import { generateLowerAlphaNumId, tsqueryParam } from 'helpers/utils';
import { User } from 'entities/User.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { In, Repository } from 'typeorm';
import { PaginationQuery } from 'types/PaginationQuery';
import { SearchUsersQuery } from './dto/search-users.query';
import { SetUserRoleDto } from './dto/set-user-role.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ContactInvitation)
    private contactInvitation: Repository<ContactInvitation>,
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
      ])
      .addSelect(
        'ts_rank(user.search_document, to_tsquery(:searchTerm))',
        'search_rank',
      )
      .where('user.search_document @@ to_tsquery(:searchTerm)')
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
        'contactUser.email',
        'contactUser.firstName',
        'contactUser.lastName',
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

  async setUserRole(info: SetUserRoleDto) {
    return this.userRepository.update(info.userId, {
      userRoleCode: info.roleCode,
    });
  }

  async userNameExists(userName: string) {
    return this.userRepository.findOne({ where: { userName }, select: ['id'] });
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

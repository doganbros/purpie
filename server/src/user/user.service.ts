import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from 'entities/Contact.entity';
import { ContactInvitation } from 'entities/ContactInvitation.entity';
import { Repository } from 'typeorm';
import { PaginationQuery } from 'types/PaginationQuery';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
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

  async deleteContact(userId: number, contactUserId: number) {
    return this.contactRepository
      .createQueryBuilder()
      .delete()
      .where('userId = :userId AND contactUserId = :contactUserId', {
        userId,
        contactUserId,
      })
      .execute();
  }
}

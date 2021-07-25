import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactRepository } from 'entities/repositories/Contact.repository';
import { PaginationQuery } from 'types/PaginationQuery';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(ContactRepository)
    private contactRepository: ContactRepository,
  ) {}

  createNewContact(userId: number, contactUserId: number) {
    if (userId === contactUserId)
      throw new BadRequestException(
        'You cannot add yourself to your contacts',
        'CONTACT_ELIGEBILITY_ERR',
      );

    return this.contactRepository
      .create({
        userId,
        contactUserId,
      })
      .save();
  }

  async listContacts(userId: number, paginatedQuery: PaginationQuery) {
    return this.contactRepository.paginate({
      skip: paginatedQuery.skip,
      take: paginatedQuery.limit,
      relations: ['contactUser'],
      where: { userId },
    });
  }

  async deleteContact(userId: number, contactId: number) {
    return this.contactRepository.delete({ userId, id: contactId });
  }
}

import { RecordRepository } from 'entities/base/RecordRepository';
import { Contact } from 'entities/Contact.entity';
import { EntityRepository } from 'typeorm';

@EntityRepository(Contact)
export class ContactRepository extends RecordRepository<Contact> {}

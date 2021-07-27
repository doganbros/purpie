import { RecordRepository } from 'entities/base/RecordRepository';
import { UserZone } from 'entities/UserZone.entity';
import { EntityRepository } from 'typeorm';

@EntityRepository(UserZone)
export class UserZoneRepository extends RecordRepository<UserZone> {}

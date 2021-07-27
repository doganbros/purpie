import { RecordRepository } from 'entities/base/RecordRepository';
import { UserChannel } from 'entities/UserChannel.entity';
import { EntityRepository } from 'typeorm';

@EntityRepository(UserChannel)
export class UserChannelRepository extends RecordRepository<UserChannel> {}

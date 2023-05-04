import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  Unique,
} from 'typeorm';
import { ChannelRoleCode } from 'types/RoleCodes';
import { RecordEntity } from './base/RecordEntity';
import { Channel } from './Channel.entity';
import { ChannelRole } from './ChannelRole.entity';
import { User } from './User.entity';
import { UserZone } from './UserZone.entity';
import { VirtualColumn } from '../src/utils/decorators/virtual-column-decorator';

@Entity('user_channel')
@Unique(['userId', 'channelId', 'channelRoleCode'])
export class UserChannel extends RecordEntity {
  @Column()
  userId: string;

  @Column({ nullable: true })
  userZoneId: string;

  @Column()
  channelId: string;

  @ManyToOne(() => UserZone, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userZoneId' })
  userZone: UserZone;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Channel, (channel) => channel.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'channelId' })
  channel: Channel;

  @OneToOne(() => ChannelRole)
  @JoinColumn({ name: 'channelRoleCode', referencedColumnName: 'roleCode' })
  channelRole: ChannelRole;

  @Column()
  channelRoleCode: ChannelRoleCode;

  @VirtualColumn()
  unseenPostCount: string;
}

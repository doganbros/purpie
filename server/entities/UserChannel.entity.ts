import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { ChannelRoleCode } from 'types/RoleCodes';
import { RecordEntity } from './base/RecordEntity';
import { Channel } from './Channel.entity';
import { ChannelRole } from './ChannelRole.entity';
import { User } from './User.entity';

@Entity('user_channel')
export class UserChannel extends RecordEntity {
  @Column()
  userId: number;

  @Column()
  channelId: number;

  @ManyToOne(() => User, (user) => user.zones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Channel, (zone) => zone.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'channelId' })
  channel: Channel;

  @OneToOne(() => ChannelRole)
  @JoinColumn({ name: 'channelRoleCode', referencedColumnName: 'roleCode' })
  channelRole: ChannelRole;

  @Column()
  channelRoleCode: ChannelRoleCode;
}

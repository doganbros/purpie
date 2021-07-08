import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { RecordEntity } from './base/RecordEntity';
import { Channel } from './Channel.entity';
import { User } from './User.entity';
import { UserChannelPermission } from './UserChannelPermission.entity';

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

  @Column()
  userChannelPermissionId: number;

  @OneToOne(() => UserChannelPermission, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'userChannelPermissionId' })
  userZonePermissions: UserChannelPermission;
}

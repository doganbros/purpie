import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { MeetingConfig } from 'types/Meeting';
import { RecordEntity } from './base/RecordEntity';
import { UserChannel } from './UserChannel.entity';
import { User } from './User.entity';
import { Zone } from './Zone.entity';

@Entity()
export class Channel extends RecordEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  topic: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  public: boolean;

  @ManyToOne(() => Zone, (zone) => zone.channels, { onDelete: 'CASCADE' })
  zone: Zone;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column({ type: 'simple-json', nullable: true })
  channelMeetingConfig: MeetingConfig;

  @Column('int')
  zoneId: number;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'adminId' })
  admin: User;

  @Column('int')
  adminId: number;

  @Column('int')
  createdById: number;

  @OneToMany(() => UserChannel, (userChannel) => userChannel.channel)
  userChannel: Array<UserChannel>;

  @ManyToMany(() => User, (user) => user.zones)
  @JoinTable({
    name: 'user_channel',
    joinColumn: { name: 'channelId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  users: Array<User>;
}

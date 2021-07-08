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
import { Channel } from './Channel.entity';
import { zoneMeetingConfig } from './data/zone-meeting-config';
import { User } from './User.entity';
import { UserZone } from './UserZone.entity';

@Entity()
export class Zone extends RecordEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  subdomain: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  public: boolean;

  @Column({ nullable: true })
  apiKey: string;

  @Column({ nullable: true })
  apiSecret: string;

  @OneToMany(() => Channel, (channel) => channel.zone)
  channels: Channel;

  @Column({ type: 'simple-json', default: zoneMeetingConfig })
  zoneMeetingConfig: MeetingConfig;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'adminId' })
  admin: User;

  @Column('int')
  createdById: number;

  @Column('int')
  adminId: number;

  @OneToMany(() => UserZone, (userZone) => userZone.zone)
  userZone: Array<UserZone>;

  @ManyToMany(() => User, (user) => user.zones)
  @JoinTable({
    name: 'user_zone',
    joinColumn: { name: 'zoneId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  users: Array<User>;
}

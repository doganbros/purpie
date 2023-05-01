import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { PostSettings } from 'types/PostSettings';
import { RecordEntity } from './base/RecordEntity';
import { UserChannel } from './UserChannel.entity';
import { User } from './User.entity';
import { Zone } from './Zone.entity';
import { defaultPostSettings } from './data/default-post-settings';

@Entity()
export class Channel extends RecordEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  public: boolean;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column('uuid')
  createdById: string;

  @Column({ nullable: true })
  displayPhoto: string;

  @Column({ nullable: true })
  backgroundPhoto: string;

  @ManyToOne(() => Zone, (zone) => zone.channels, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'zoneId' })
  zone: Zone;

  @Column('uuid')
  zoneId: string;

  @OneToMany(() => UserChannel, (userChannel) => userChannel.channel)
  userChannel: Array<UserChannel>;

  @ManyToMany(() => User, (user) => user.zones)
  @JoinTable({
    name: 'user_channel',
    joinColumn: { name: 'channelId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  users: Array<User>;

  @Column('tsvector', { select: false })
  search_document: any;

  @Column({ type: 'simple-json', select: false, default: defaultPostSettings })
  postSettings: PostSettings;
}

import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { PostSettings } from 'types/PostSettings';
import { RecordEntity } from './base/RecordEntity';
import { UserChannel } from './UserChannel.entity';
import { User } from './User.entity';
import { Zone } from './Zone.entity';
import { Category } from './Category.entity';
import { defaultPostSettings } from './data/default-post-settings';

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

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column('int')
  createdById: number;

  @Column({ nullable: true })
  displayPhoto: string;

  @OneToOne(() => Category, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column('int', { nullable: true })
  categoryId: number | null;

  @ManyToOne(() => Zone, (zone) => zone.channels, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'zoneId' })
  zone: Zone;

  @Column('int')
  zoneId: number;

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

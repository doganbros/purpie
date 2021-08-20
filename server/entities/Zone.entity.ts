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
import { RecordEntity } from './base/RecordEntity';
import { Category } from './Category.entity';
import { Channel } from './Channel.entity';
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

  @OneToMany(() => Channel, (channel) => channel.zone)
  channels: Channel;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column('int')
  createdById: number;

  @OneToOne(() => Category, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column('int')
  categoryId: number;

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

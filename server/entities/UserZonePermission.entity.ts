import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserZone } from './UserZone.entity';

@Entity()
export class UserZonePermission extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserZone, (uz) => uz.userZonePermissions, {
    onDelete: 'CASCADE',
  })
  userZone: UserZone;

  @Column({ default: false })
  canCreateChannel: boolean;

  @Column({ default: false })
  canAddUser: boolean;
}

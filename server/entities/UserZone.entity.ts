import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { RecordEntity } from './base/RecordEntity';
import { User } from './User.entity';
import { UserZonePermission } from './UserZonePermission.entity';
import { Zone } from './Zone.entity';

@Entity('user_zone')
export class UserZone extends RecordEntity {
  @Column()
  userId: number;

  @Column()
  zoneId: number;

  @ManyToOne(() => User, (user) => user.zones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Zone, (zone) => zone.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'zoneId' })
  zone: Zone;

  @Column()
  userZonePermissionId: number;

  @OneToOne(() => UserZonePermission, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'userZonePermissionId' })
  userZonePermissions: UserZonePermission;
}

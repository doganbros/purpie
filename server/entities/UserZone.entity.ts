import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { ZoneRoleCode } from 'types/RoleCodes';
import { RecordEntity } from './base/RecordEntity';
import { User } from './User.entity';
import { Zone } from './Zone.entity';
import { ZoneRole } from './ZoneRole.entity';

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

  @OneToOne(() => ZoneRole)
  @JoinColumn({ name: 'zoneRoleCode', referencedColumnName: 'roleCode' })
  zoneRole: ZoneRole;

  @Column()
  zoneRoleCode: ZoneRoleCode;
}

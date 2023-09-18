import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ZoneRoleCode } from '../types/RoleCodes';

@Entity()
export class ZoneRole extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roleCode: ZoneRoleCode;

  @Column()
  zoneId: string;

  @Column({ default: true })
  canCreateChannel: boolean;

  @Column({ default: true })
  canInvite: boolean;

  @Column({ default: false })
  canDelete: boolean;

  @Column({ default: false })
  canEdit: boolean;

  @Column({ default: false })
  canManageRole: boolean;
}

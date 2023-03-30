import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { ZoneRole } from '../types/RoleCodes';

@Entity()
export class ZonePermission extends BaseEntity {
  @PrimaryColumn()
  roleCode: ZoneRole;

  @Column({ default: false })
  canCreateChannel: boolean;

  @Column({ default: false })
  canInvite: boolean;

  @Column({ default: false })
  canDelete: boolean;

  @Column({ default: false })
  canEdit: boolean;

  @Column({ default: false })
  canManageRole: boolean;
}

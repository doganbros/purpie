import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { ChannelRole } from '../types/RoleCodes';

@Entity()
export class ChannelPermission extends BaseEntity {
  @PrimaryColumn()
  roleCode: ChannelRole;

  @Column({ default: false })
  canInvite: boolean;

  @Column({ default: false })
  canDelete: boolean;

  @Column({ default: false })
  canEdit: boolean;

  @Column({ default: false })
  canManageRole: boolean;
}

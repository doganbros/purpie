import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { ZoneRoleCode } from 'types/RoleCodes';

@Entity()
export class ZoneRole extends BaseEntity {
  @PrimaryColumn()
  roleCode: ZoneRoleCode;

  @Column()
  roleName: string;

  @Column({ default: true })
  canCreateChannel: boolean;

  @Column({ default: true })
  canInvite: boolean;

  @Column({ default: false })
  canDelete: boolean;

  @Column({ default: true })
  canEdit: boolean;
}

import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { ChannelRoleCode } from 'types/RoleCodes';

@Entity()
export class ChannelRole extends BaseEntity {
  @PrimaryColumn()
  roleCode: ChannelRoleCode;

  @Column()
  roleName: string;

  @Column({ default: true })
  canInvite: boolean;

  @Column({ default: false })
  canDelete: boolean;

  @Column({ default: true })
  canEdit: boolean;
}

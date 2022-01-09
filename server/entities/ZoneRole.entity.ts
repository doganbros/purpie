import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { ZoneRoleCode } from 'types/RoleCodes';

@Entity()
export class ZoneRole extends BaseEntity {
  @PrimaryColumn()
  @ApiProperty()
  roleCode: ZoneRoleCode;

  @Column()
  @ApiProperty()
  roleName: string;

  @Column({ default: true })
  @ApiProperty()
  canCreateChannel: boolean;

  @Column({ default: true })
  @ApiProperty()
  canInvite: boolean;

  @Column({ default: false })
  @ApiProperty()
  canDelete: boolean;

  @Column({ default: true })
  @ApiProperty()
  canEdit: boolean;

  @Column({ default: false })
  @ApiProperty()
  canManageRole: boolean;
}

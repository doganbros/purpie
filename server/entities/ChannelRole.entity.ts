import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { ChannelRoleCode } from 'types/RoleCodes';

@Entity()
export class ChannelRole extends BaseEntity {
  @PrimaryColumn()
  @ApiProperty()
  roleCode: ChannelRoleCode;

  @Column()
  @ApiProperty()
  roleName: string;

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
  canSetRole: boolean;
}

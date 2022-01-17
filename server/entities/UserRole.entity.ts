import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { UserRoleCode } from 'types/RoleCodes';

@Entity()
export class UserRole extends BaseEntity {
  @PrimaryColumn()
  @ApiProperty()
  roleCode: UserRoleCode;

  @Column()
  @ApiProperty()
  roleName: string;

  @Column({ default: false })
  isSystemRole: boolean;

  @Column({ default: true })
  @ApiProperty()
  canCreateZone: boolean;

  @Column({ default: false })
  @ApiProperty()
  canCreateClient: boolean;

  @Column({ default: false })
  @ApiProperty()
  canManageRole: boolean;
}

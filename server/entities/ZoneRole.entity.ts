import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ZoneRoleCode } from '../types/RoleCodes';

@Entity()
export class ZoneRole extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ApiProperty()
  @Column()
  roleCode: ZoneRoleCode;

  @ApiProperty()
  @Column()
  zoneId: string;

  @Column({ default: true })
  @ApiProperty()
  canCreateChannel: boolean;

  @Column({ default: true })
  @ApiProperty()
  canInvite: boolean;

  @Column({ default: false })
  @ApiProperty()
  canDelete: boolean;

  @Column({ default: false })
  @ApiProperty()
  canEdit: boolean;

  @Column({ default: false })
  @ApiProperty()
  canManageRole: boolean;
}

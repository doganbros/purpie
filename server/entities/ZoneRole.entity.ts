import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ZoneRole extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ApiProperty()
  @Column()
  roleCode: string;

  @ApiProperty()
  @Column()
  zoneId: string;

  @Column()
  @ApiProperty()
  roleName: string;

  @Column({ default: false })
  @ApiProperty()
  isSystemRole: boolean;

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

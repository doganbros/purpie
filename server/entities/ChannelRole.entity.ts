import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ChannelRoleCode } from '../types/RoleCodes';

@Entity()
export class ChannelRole extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ApiProperty()
  @Column()
  roleCode: ChannelRoleCode;

  @ApiProperty()
  @Column()
  channelId: string;

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

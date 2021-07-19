import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { UserRoleCode } from 'types/RoleCodes';

@Entity()
export class UserRole extends BaseEntity {
  @PrimaryColumn()
  roleCode: UserRoleCode;

  @Column()
  roleName: string;

  @Column({ default: true })
  canCreateZone: boolean;
}

import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { ClientRoleCode } from 'types/RoleCodes';

@Entity()
export class ClientRole extends BaseEntity {
  @PrimaryColumn()
  roleCode: ClientRoleCode;

  @Column()
  roleName: string;

  @Column({ default: false })
  manageMeeting: boolean;
}

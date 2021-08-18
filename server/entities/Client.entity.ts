import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { ClientRoleCode } from 'types/RoleCodes';
import { RecordEntity } from './base/RecordEntity';
import { ClientRole } from './ClientRole.entity';
import { User } from './User.entity';

@Entity()
export class Client extends RecordEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  apiKey: string;

  @Column()
  apiSecret: string;

  @OneToOne(() => ClientRole)
  @JoinColumn({ name: 'clientRoleCode', referencedColumnName: 'roleCode' })
  clientRole: ClientRole;

  @Column({ nullable: true, type: String })
  refreshToken: string | null;

  @Column()
  clientRoleCode: ClientRoleCode;

  @OneToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdById', referencedColumnName: 'id' })
  createdBy: User;

  @Column()
  createdById: number;
}

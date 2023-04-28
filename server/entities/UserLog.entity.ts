import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { RecordEntity } from './base/RecordEntity';
import { User } from './User.entity';

@Entity()
export class UserLog extends RecordEntity {
  @Column()
  action: string;

  @Column()
  payload: string;

  @OneToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdById', referencedColumnName: 'id' })
  createdBy: User;

  @Column({ nullable: true })
  createdById: string;
}

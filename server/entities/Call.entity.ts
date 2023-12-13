import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { RecordEntity } from './base/RecordEntity';
import { User } from './User.entity';

@Entity()
export class Call extends RecordEntity {
  @Column()
  callee: string;

  @Column()
  roomName: string;

  @Column({ default: true })
  isLive: boolean;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'createdById', referencedColumnName: 'id' })
  createdBy: User;

  @Column({ nullable: true })
  createdById: string;
}

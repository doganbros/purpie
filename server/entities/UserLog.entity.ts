import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { RecordEntity } from './base/RecordEntity';
import { User } from './User.entity';
import { Channel } from './Channel.entity';

@Entity()
export class UserLog extends RecordEntity {
  @Column()
  action: string;

  @Column()
  payload: string;

  @ManyToOne(() => Channel, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'channelId' })
  channel: Channel;

  @Column({ nullable: true })
  channelId: string;

  @OneToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdById', referencedColumnName: 'id' })
  createdBy: User;

  @Column({ nullable: true })
  createdById: string;
}

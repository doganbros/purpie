import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { RecordEntity } from './base/RecordEntity';
import { Channel } from './Channel.entity';
import { User } from './User.entity';
import { Zone } from './Zone.entity';

@Entity()
export class Invitation extends RecordEntity {
  @Column()
  email: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'email', referencedColumnName: 'email' })
  invitee: User;

  @ManyToOne(() => Channel, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'channelId' })
  channel: Channel;

  @ManyToOne(() => Zone, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'zoneId' })
  zone: Zone;

  @Column({ nullable: true })
  channelId: string;

  @Column({ nullable: true })
  zoneId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column({ nullable: true })
  createdById: string;
}

import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { MeetingConfig } from 'types/Meeting';
import { RecordEntity } from './base/RecordEntity';
import { Channel } from './Channel.entity';
import { baseMeetingConfig } from './data/base-meeting-config';
import { User } from './User.entity';
import { Zone } from './Zone.entity';

@Entity()
export class Meeting extends RecordEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column()
  createdById: number;

  @ManyToOne(() => Zone, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'zoneId' })
  zone: Zone;

  @ManyToOne(() => Channel, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'channelId' })
  channel: Channel;

  @Column({ nullable: true })
  zoneId: number;

  @Column({ nullable: true })
  channelId: number;

  @Column({ default: false })
  public: boolean;

  @Column({ default: false })
  userContactExclusive: boolean;

  @Column({ type: 'simple-json', default: baseMeetingConfig })
  config: MeetingConfig;
}

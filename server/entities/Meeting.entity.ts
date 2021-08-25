import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { MeetingConfig } from 'types/Meeting';
import { RecordEntity } from './base/RecordEntity';
import { Channel } from './Channel.entity';
import { baseMeetingConfig } from './data/base-meeting-config';
import { User } from './User.entity';

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

  @Column({ nullable: true })
  conferenceStartDate: Date;

  @Column({ nullable: true })
  conferenceEndDate: Date;

  @Column({ nullable: true })
  timeZone: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column()
  createdById: number;

  @ManyToOne(() => Channel, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'channelId' })
  channel: Channel;

  @Column({ nullable: true })
  channelId: number;

  @Column({ default: false })
  public: boolean;

  @Column({ default: false })
  liveStream: boolean;

  @Column({ default: false })
  record: boolean;

  @Column({ default: false })
  userContactExclusive: boolean;

  @Column({ type: 'simple-json', default: baseMeetingConfig })
  config: MeetingConfig;
}

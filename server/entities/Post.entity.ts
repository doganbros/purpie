import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { MeetingConfig } from 'types/Meeting';
import { PostType } from 'types/Post';
import { RecordEntity } from './base/RecordEntity';
import { Channel } from './Channel.entity';
import { PostTag } from './PostTag.entity';
import { User } from './User.entity';

@Entity()
export class Post extends RecordEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ nullable: true, type: Date })
  conferenceStartDate: Date | null;

  @Column({ nullable: true, type: Date })
  conferenceEndDate: Date | null;

  @Column({ nullable: true })
  timeZone: string;

  @Column({ default: 'meeting' })
  type: PostType;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column({ nullable: true })
  createdById: number;

  @ManyToOne(() => Channel, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'channelId' })
  channel: Channel;

  @Column({ nullable: true })
  channelId: number;

  @Column({ default: false })
  streaming: boolean;

  @Column({ default: false })
  public: boolean;

  @Column({ default: false })
  liveStream: boolean;

  @Column({ default: false })
  record: boolean;

  @OneToMany(() => PostTag, (postTag) => postTag.post)
  tags: Array<PostTag>;

  @Column({ nullable: true })
  telecastRepeatUrl: string;

  @Column({ default: false })
  userContactExclusive: boolean;

  @Column({ type: 'simple-json', nullable: true })
  config: MeetingConfig;
}

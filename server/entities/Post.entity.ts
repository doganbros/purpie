import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { JitsiConfig } from 'types/Meeting';
import { PostType } from 'types/Post';
import { RecordEntity } from './base/RecordEntity';
import { Channel } from './Channel.entity';
import { PostReaction } from './PostReaction.entity';
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
  // Should be visible to only user who created
  private: boolean;

  @Column({ default: false })
  liveStream: boolean;

  @Column({ default: false })
  record: boolean;

  @Column({ nullable: true, type: 'character varying' })
  videoName: string | null;

  @Column({ default: false })
  userContactExclusive: boolean;

  @Column({ type: 'simple-json', nullable: true, select: false })
  config: JitsiConfig;

  @Column('tsvector', { select: false })
  search_document: any;

  @OneToOne(() => PostReaction, (postReaction) => postReaction.postId, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'postReactionId' })
  postReaction: PostReaction;

  @Column({ nullable: true })
  postReactionId: number;

  @Column({ default: true })
  allowReaction: boolean;

  @Column({ default: true })
  allowComment: boolean;

  @Column({ select: false, nullable: true, insert: false, type: 'boolean' })
  liked: boolean;

  @Column({ select: false, nullable: true, insert: false, type: 'boolean' })
  saved: boolean;

  @Column({ select: false, nullable: true, insert: false, type: 'boolean' })
  disliked: boolean;
}

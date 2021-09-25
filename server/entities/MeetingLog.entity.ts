import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { MeetingEvent } from 'types/MeetingEvent';
import { RecordEntity } from './base/RecordEntity';
import { Post } from './Post.entity';
import { User } from './User.entity';

@Entity()
export class MeetingLog extends RecordEntity {
  @Column({ nullable: true })
  userId: number;

  @Column()
  meetingSlug: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'meetingSlug', referencedColumnName: 'slug' })
  meeting: Post;

  @Column()
  event: MeetingEvent;

  @Column({ nullable: true, type: 'simple-json' })
  extraInfo: string;
}

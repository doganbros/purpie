import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { RecordEntity } from './base/RecordEntity';
import { Post } from './Post.entity';

@Entity()
@Unique(['meetingSlug', 'fileName'])
export class MeetingRecording extends RecordEntity {
  @Column()
  meetingSlug: string;

  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'meetingSlug', referencedColumnName: 'slug' })
  meeting: Post;

  @Column()
  fileName: string;
}

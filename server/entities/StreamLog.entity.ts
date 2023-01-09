import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { StreamEvent } from 'types/StreamEvent';
import { RecordEntity } from './base/RecordEntity';
import { User } from './User.entity';
import { Post } from './Post.entity';

@Entity()
export class StreamLog extends RecordEntity {
  @Column({ nullable: true })
  userId: string;

  @Column()
  slug: string;

  @Column({ default: 'video' })
  mediaType: 'video' | 'audio';

  @ManyToOne(() => Post, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'slug', referencedColumnName: 'slug' })
  post: Post;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  event: StreamEvent;

  @Column({ nullable: true, type: 'simple-json' })
  extraInfo: string;
}

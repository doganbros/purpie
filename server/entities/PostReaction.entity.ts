import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { RecordEntity } from './base/RecordEntity';
import { Post } from './Post.entity';

@Entity()
export class PostReaction extends RecordEntity {
  @Column({ default: 0 })
  likesCount: number;

  @Column({ default: 0 })
  dislikesCount: number;

  @Column({ default: 0 })
  commentsCount: number;

  @Column({ default: 0 })
  viewsCount: number;

  @Column({ default: 0 })
  liveStreamViewersCount: number;

  @OneToOne(() => Post, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @Column({ unique: true })
  postId: string;
}

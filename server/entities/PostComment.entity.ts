import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { RecordEntity } from './base/RecordEntity';
import { Post } from './Post.entity';
import { User } from './User.entity';

@Entity()
export class PostComment extends RecordEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @Column()
  postId: number;

  @Column()
  comment: string;

  @Column({ nullable: true, type: 'int' })
  parentId: number | null;

  @Column({ default: false })
  edited: boolean;

  @Column({ default: false })
  publishedInLiveStream: boolean;

  @Column({ select: false, nullable: true, insert: false, type: 'int' })
  replyCount: number;
}

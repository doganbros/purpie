import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { RecordEntity } from './base/RecordEntity';
import { Post } from './Post.entity';
import { PostComment } from './PostComment.entity';
import { User } from './User.entity';

@Entity()
export class Notification extends RecordEntity {
  @Column()
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId', referencedColumnName: 'id' })
  post: Post;

  @Column({ nullable: true })
  postId: number;

  @ManyToOne(() => PostComment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postCommentId', referencedColumnName: 'id' })
  postComment: PostComment;

  @Column({ nullable: true })
  postCommentId: number;

  @Column({ nullable: true })
  message: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column({ nullable: true })
  createdById: number;

  @Column({ default: 1 })
  counter: number;

  @Column({ type: 'character varying' })
  type:
    | 'post'
    | 'post_like'
    | 'post_comment'
    | 'post_comment_like'
    | 'post_comment_reply'
    | 'post_comment_mention'
    | 'contact_request_accepted'
    | 'system_notification';

  @Column({ nullable: true })
  readOn: Date;

  @Column({ nullable: true })
  viewedOn: Date;
}

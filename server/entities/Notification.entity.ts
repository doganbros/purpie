import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { RecordEntity } from './base/RecordEntity';
import { Post } from './Post.entity';
import { PostComment } from './PostComment.entity';
import { PostCommentLike } from './PostCommentLike.entity';
import { PostLike } from './PostLike.entity';
import { User } from './User.entity';

export type NotificationType =
  | 'post'
  | 'post_like'
  | 'post_comment'
  | 'post_comment_like'
  | 'post_comment_reply'
  | 'post_comment_mention'
  | 'contact_request_accepted'
  | 'contact_request_received'
  | 'system_notification';

@Entity()
export class Notification extends RecordEntity {
  @Column()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId', referencedColumnName: 'id' })
  post: Post;

  @Column({ nullable: true })
  postId: string;

  @ManyToOne(() => PostComment)
  @JoinColumn({ name: 'postCommentId', referencedColumnName: 'id' })
  postComment: PostComment;

  @Column({ nullable: true })
  postCommentId: string;

  @ManyToOne(() => PostLike)
  @JoinColumn({ name: 'postLikeId', referencedColumnName: 'id' })
  postLike: PostLike;

  @Column({ nullable: true })
  postLikeId: string;

  @ManyToOne(() => PostCommentLike)
  @JoinColumn({ name: 'postCommentLikeId', referencedColumnName: 'id' })
  postCommentLike: PostCommentLike;

  @Column({ nullable: true })
  postCommentLikeId: string;

  @Column({ nullable: true })
  message: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column({ nullable: true })
  createdById: string;

  @Column({ default: 1 })
  counter: number;

  @Column({ type: 'character varying' })
  type: NotificationType;

  @Column({ nullable: true })
  readOn: Date;

  @Column({ nullable: true })
  viewedOn: Date;
}

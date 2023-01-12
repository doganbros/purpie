import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { RecordEntity } from './base/RecordEntity';
import { Post } from './Post.entity';
import { User } from './User.entity';

@Entity()
export class PostComment extends RecordEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @Column()
  postId: string;

  @Column()
  comment: string;

  @OneToOne(() => PostComment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parentId', referencedColumnName: 'id' })
  parent?: PostComment;

  @Column({ nullable: true, type: 'int' })
  parentId: string | null;

  @Column({ default: false })
  edited: boolean;

  @Column({ default: false })
  publishedInLiveStream: boolean;

  @Column({ select: false, nullable: true, insert: false, type: 'int' })
  replyCount: number;

  @Column({ select: false, nullable: true, insert: false, type: 'int' })
  likesCount: number;

  @Column({ select: false, nullable: true, insert: false, type: 'boolean' })
  liked: boolean;
}

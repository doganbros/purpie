import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { RecordEntity } from './base/RecordEntity';
import { Post } from './Post.entity';
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

  @Column({ nullable: true })
  message: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column({ nullable: true })
  createdById: number;

  @Column({ type: 'character varying' })
  type: 'post' | 'like' | 'comment' | 'mention' | 'system_notification';

  @Column({ nullable: true })
  readOn: Date;
}

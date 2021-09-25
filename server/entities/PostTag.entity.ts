import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Post } from './Post.entity';

@Entity()
export class PostTag extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  value: string;

  @ManyToOne(() => Post, (post) => post.tags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @Column()
  postId: number;
}

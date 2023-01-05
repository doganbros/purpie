import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { RecordEntity } from './base/RecordEntity';
import { Post } from './Post.entity';
import { User } from './User.entity';

@Entity()
@Unique(['postId', 'userId'])
export class SavedPost extends RecordEntity {
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
}

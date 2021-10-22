import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { RecordEntity } from './base/RecordEntity';
import { Post } from './Post.entity';

@Entity()
@Unique(['slug', 'fileName'])
export class PostVideo extends RecordEntity {
  @Column()
  slug: string;

  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'slug', referencedColumnName: 'slug' })
  post: Post;

  @Column()
  fileName: string;
}

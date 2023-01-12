import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  Unique,
} from 'typeorm';
import { RecordEntity } from './base/RecordEntity';
import { PostFolder } from './PostFolder.entity';
import { Post } from './Post.entity';

@Entity()
@Unique(['postId', 'folderId'])
export class PostFolderItem extends RecordEntity {
  @OneToOne(() => Post, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId', referencedColumnName: 'id' })
  post: Post;

  @Column()
  postId: string;

  @ManyToOne(() => PostFolder, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'folderId', referencedColumnName: 'id' })
  folder: PostFolder;

  @Column()
  folderId: string;
}

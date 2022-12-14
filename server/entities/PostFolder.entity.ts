import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { RecordEntity } from './base/RecordEntity';
import { User } from './User.entity';
import { PostFolderItem } from './PostFolderItem.entity';

@Entity()
export class PostFolder extends RecordEntity {
  @Column()
  title: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'createdById', referencedColumnName: 'id' })
  createdBy: User;

  @Column()
  createdById: number;

  @OneToMany(() => PostFolderItem, (post) => post.folder)
  folderItems: Array<PostFolderItem>;

  @Column({ default: 0, type: 'int' })
  itemCount: number;
}

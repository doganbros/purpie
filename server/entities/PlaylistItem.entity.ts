import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { RecordEntity } from './base/RecordEntity';
import { Playlist } from './Playlist.entity';
import { Post } from './Post.entity';

@Entity()
@Unique(['postId', 'playlistId'])
export class PlaylistItem extends RecordEntity {
  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId', referencedColumnName: 'id' })
  post: Post;

  @Column()
  postId: number;

  @ManyToOne(() => Playlist, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'playlistId', referencedColumnName: 'id' })
  playlist: Playlist;

  @Column()
  playlistId: number;
}

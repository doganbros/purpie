import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { RecordEntity } from './base/RecordEntity';
import { Channel } from './Channel.entity';
import { User } from './User.entity';
import { PlaylistItem } from './PlaylistItem.entity';

@Entity()
export class Playlist extends RecordEntity {
  @Column()
  title: string;

  @Column({ default: true })
  public: boolean;

  @Column({ nullable: true, type: 'character varying' })
  description: string | null;

  @ManyToOne(() => Channel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'channelId', referencedColumnName: 'id' })
  channel: Channel;

  @Column({ nullable: true })
  channelId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'createdById', referencedColumnName: 'id' })
  createdBy: User;

  @Column()
  createdById: number;

  @OneToMany(() => PlaylistItem, (post) => post.playlist)
  playlistItems: Array<PlaylistItem>;

  @Column({ select: false, nullable: true, insert: false, type: 'int' })
  itemCount: number;
}

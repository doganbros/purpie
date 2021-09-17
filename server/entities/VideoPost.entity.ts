import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { RecordEntity } from './base/RecordEntity';
import { Channel } from './Channel.entity';
import { User } from './User.entity';

@Entity()
export class VideoPost extends RecordEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ unique: true })
  slug: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column()
  createdById: number;

  @ManyToOne(() => Channel, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'channelId' })
  channel: Channel;

  @Column({ nullable: true })
  channelId: number;

  @Column({ default: false })
  public: boolean;

  @Column({ default: false })
  userContactExclusive: boolean;
}

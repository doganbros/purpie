import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { StreamEvent } from 'types/StreamEvent';
import { RecordEntity } from './base/RecordEntity';
import { User } from './User.entity';

@Entity()
export class StreamLog extends RecordEntity {
  @Column({ nullable: true })
  userId: number;

  @Column()
  slug: string;

  @Column({ default: 'video' })
  mediaType: 'video' | 'audio';

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  event: StreamEvent;

  @Column({ nullable: true, type: 'simple-json' })
  extraInfo: string;
}

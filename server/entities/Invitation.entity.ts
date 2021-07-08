import { Column, Entity, ManyToOne } from 'typeorm';
import { RecordEntity } from './base/RecordEntity';
import { Channel } from './Channel.entity';
import { User } from './User.entity';
import { Zone } from './Zone.entity';

@Entity()
export class Invitation extends RecordEntity {
  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Channel, { nullable: true })
  channel: Channel;

  @ManyToOne(() => Zone, { nullable: true })
  zone: Zone;

  @Column({ nullable: true })
  channelId: number;

  @Column({ nullable: true })
  zoneId: number;
}

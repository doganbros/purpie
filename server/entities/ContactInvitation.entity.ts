import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { RecordEntity } from './base/RecordEntity';
import { User } from './User.entity';

@Entity()
@Unique(['inviterId', 'inviteeId'])
export class ContactInvitation extends RecordEntity {
  @Column()
  inviterId: number;

  @Column()
  inviteeId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'inviterId' })
  inviter: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'inviteeId' })
  invitee: User;
}

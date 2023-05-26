import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { RecordEntity } from './base/RecordEntity';
import { User } from './User.entity';
import { VirtualColumn } from '../src/utils/decorators/virtual-column-decorator';

@Entity()
@Unique(['userId', 'contactUserId'])
export class Contact extends RecordEntity {
  @Column()
  userId: string;

  @Column()
  contactUserId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contactUserId' })
  contactUser: User;

  @VirtualColumn()
  lastOnlineDate: Date;
}

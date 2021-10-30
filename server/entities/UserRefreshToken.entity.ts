import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from './User.entity';

@Entity()
export class UserRefreshToken extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  token: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdOn: Date;

  @Column({ nullable: true, type: 'character varying' })
  mattermostTokenId?: string | null;
}

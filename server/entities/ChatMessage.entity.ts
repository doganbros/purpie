import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { RecordEntity } from './base/RecordEntity';
import { User } from './User.entity';

@Entity()
export class ChatMessage extends RecordEntity {
  @Column({ unique: true })
  identifier: string;

  @OneToOne(() => ChatMessage, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'parentIdentifier', referencedColumnName: 'identifier' })
  parent?: ChatMessage;

  @Column({ nullable: true })
  parentIdentifier: string;

  @Column({ type: 'character varying', default: 'direct' })
  medium: 'direct' | 'channel' | 'post';

  @Column()
  to: number;

  @Column({ type: 'text' })
  message: string;

  @Column({ nullable: true })
  readOn: Date;

  @Column({ default: false })
  isSystemMessage: boolean;

  @Column({ default: false })
  edited: boolean;

  @Column({ default: false })
  deleted: boolean;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'createdById', referencedColumnName: 'id' })
  createdBy: User;

  @Column({ nullable: true })
  createdById: number;
}

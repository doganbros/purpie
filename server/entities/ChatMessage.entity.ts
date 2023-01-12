import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { RecordEntity } from './base/RecordEntity';
import { ChatMessageAttachment } from './ChatMessageAttachment.entity';
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
  to: string;

  @Column({ type: 'text' })
  message: string;

  @OneToMany(
    () => ChatMessageAttachment,
    (chatMsgAttachment) => chatMsgAttachment.chatMessage,
  )
  attachments: Array<ChatMessageAttachment>;

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
  createdById: string;
}

import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { RecordEntity } from './base/RecordEntity';
import { ChatMessage } from './ChatMessage.entity';
import { User } from './User.entity';

@Entity()
export class ChatMessageAttachment extends RecordEntity {
  @ManyToOne(() => ChatMessage, (chatMsg) => chatMsg.attachments)
  @JoinColumn({ name: 'chatMessageId', referencedColumnName: 'id' })
  chatMessage: ChatMessage;

  @Column()
  chatMessageId: string;

  @Column()
  name: string;

  @Column()
  originalFileName: string;

  @OneToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdById', referencedColumnName: 'id' })
  createdBy: User;

  @Column({ nullable: true })
  createdById: string;
}

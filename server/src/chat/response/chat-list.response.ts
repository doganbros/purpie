import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../../entities/User.entity';
import { ChatMessageAttachment } from '../../../entities/ChatMessageAttachment.entity';

class Chat {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdOn: Date;

  @ApiProperty()
  identifier: string;

  @ApiPropertyOptional()
  parentIdentifier: string;

  @ApiProperty({ enum: ['direct', 'channel', 'post'] })
  medium: string;

  @ApiProperty()
  to: string;

  @ApiProperty()
  message: string;

  @ApiPropertyOptional()
  readOn: Date;

  @ApiProperty()
  isSystemMessage: boolean;

  @ApiProperty()
  edited: boolean;

  @ApiProperty()
  deleted: boolean;

  @ApiProperty()
  createdById: string;

  @ApiProperty()
  createdBy: User;

  @ApiProperty()
  attachments: ChatMessageAttachment[];
}

export class ChatListResponse {
  @ApiProperty({ isArray: true })
  data: Chat;

  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  skip: number;
}

import { User } from 'entities/User.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType } from '../../../entities/Notification.entity';

class NotificationPost {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdOn: Date;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description: string;
}
class Notification {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdOn: Date;

  @ApiPropertyOptional()
  message: string;

  @ApiProperty()
  counter: number;

  @ApiProperty()
  type: NotificationType;

  @ApiProperty()
  readOn: Date;

  @ApiProperty()
  viewedOn: Date;

  @ApiProperty()
  post: NotificationPost;

  @ApiProperty()
  createdBy: User;
}

export class NotificationResponse {
  @ApiProperty({ isArray: true })
  data: Notification;

  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  skip: number;
}

export class NotificationCount {
  @ApiProperty()
  unviewedCount: number;

  @ApiProperty()
  unreadCount: number;
}

import { IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MarkNotificationDto {
  @ApiProperty({
    type: String,
    required: false,
    description:
      'Notification to mark as read. If null is specified, all notifications will be marked as read',
  })
  @IsUUID()
  @IsOptional()
  notificationId?: string | null;
}

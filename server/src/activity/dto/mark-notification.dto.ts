import { IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MarkNotificationDto {
  @ApiProperty({
    type: Number,
    required: false,
    description:
      'Notification to mark as read. If null is specified, all notifications will be marked as read',
  })
  @IsInt()
  @IsOptional()
  notificationId?: number | null;
}

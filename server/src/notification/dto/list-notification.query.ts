import { IsIn, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationQuery } from 'types/PaginationQuery';

export class ListNotificationQuery extends PaginationQuery {
  @ApiProperty({
    required: false,
    enum: ['all', 'unread', 'read'],
    description:
      'Get all notifications, unread notifications or unread notifications',
  })
  @IsOptional()
  @IsIn(['all', 'unread', 'read'])
  type: 'all' | 'unread' | 'read';
}

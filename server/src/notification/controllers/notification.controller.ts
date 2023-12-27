import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseArrayPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserTokenPayload } from 'src/auth/interfaces/user.interface';
import { ListNotificationQuery } from '../dto/list-notification.query';
import { NotificationService } from '../services/notification.service';
import {
  NotificationCount,
  NotificationResponse,
} from '../responses/notification.response';

@Controller({ version: '1', path: 'notification' })
@ApiTags('Notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get('count')
  @ApiOkResponse({
    description: 'Get number of count of notification',
    type: NotificationCount,
  })
  @ApiOperation({
    summary: 'Get Notification Count',
    description: 'Get number of count of notification.',
  })
  @IsAuthenticated()
  getNotificationCount(@CurrentUser() user: UserTokenPayload) {
    return this.notificationService.getNotificationCount(user.id);
  }

  @Get('list')
  @ApiOkResponse({
    description: 'List notifications with given query parameters',
    type: NotificationResponse,
  })
  @ApiOperation({
    summary: 'List Notifications',
    description: 'List notifications with given query parameters.',
  })
  @IsAuthenticated()
  listNotifications(
    @CurrentUser() user: UserTokenPayload,
    @Query() query: ListNotificationQuery,
  ) {
    return this.notificationService.listNotifications(user.id, query);
  }

  @Post('view')
  @ApiOkResponse({
    description: 'View specified notification',
  })
  @ApiOperation({
    summary: 'View Notification',
    description:
      'View specified notification and update "readOn" date property on notification',
  })
  @IsAuthenticated()
  async viewNotifications(
    @CurrentUser() user: UserTokenPayload,
    @Query(
      'notificationIds',
      new DefaultValuePipe('-1'),
      new ParseArrayPipe({ items: String, separator: ',' }),
    )
    notificationIds: Array<string>,
  ) {
    const result = await this.notificationService.markNotificationsAsViewed(
      user.id,
      notificationIds,
    );

    return result.affected ? 'Created' : 'OK';
  }

  @Post('read/:notificationId?')
  @ApiParam({
    required: false,
    name: 'notificationId',
    type: Number,
    allowEmptyValue: true,
  })
  @ApiOkResponse({
    description: 'Read specified notification',
  })
  @ApiOperation({
    summary: 'Read Notification',
    description:
      'Read specified notification and update "readOn" date property on notification.',
  })
  @IsAuthenticated()
  async readNotifications(
    @CurrentUser() user: UserTokenPayload,
    @Param('notificationId') notificationId?: string,
  ) {
    await this.notificationService.markNotificationsAsRead(
      user.id,
      notificationId || undefined,
    );
  }
}

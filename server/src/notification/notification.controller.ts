import {
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserTokenPayload } from 'src/auth/interfaces/user.interface';
import { ListNotificationQuery } from './dto/list-notification.query';
import { NotificationService } from './notification.service';

@Controller({ version: '1', path: 'notification' })
@ApiTags('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get('count')
  @IsAuthenticated()
  getNotificationCount(@CurrentUser() user: UserTokenPayload) {
    return this.notificationService.getNotificationCount(user.id);
  }

  @Get('list')
  @IsAuthenticated()
  listNotifications(
    @CurrentUser() user: UserTokenPayload,
    @Query() query: ListNotificationQuery,
  ) {
    return this.notificationService.listNotifications(user.id, query);
  }

  @Post('view')
  @IsAuthenticated()
  async viewNotifications(
    @CurrentUser() user: UserTokenPayload,
    @Query(
      'notificationIds',
      new ParseArrayPipe({ items: Number, separator: ',' }),
    )
    notificationIds: Array<number>,
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
  @IsAuthenticated()
  async readNotifications(
    @CurrentUser() user: UserTokenPayload,
    @Param('notificationId') notificationId?: string,
  ) {
    const result = await this.notificationService.markNotificationsAsRead(
      user.id,
      notificationId ? Number.parseInt(notificationId, 10) : undefined,
    );
    return result.affected ? 'Created' : 'OK';
  }
}

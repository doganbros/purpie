import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserTokenPayload } from 'src/auth/interfaces/user.interface';
import { PaginationQuery } from 'types/PaginationQuery';
import {
  PublicChannelSuggestionListResponse,
  PublicZoneSuggestionListResponse,
} from '../activity.response';
import { MarkNotificationDto } from '../dto/mark-notification.dto';
import { ActivityService } from '../services/activity.service';

@Controller({ path: 'activity', version: '1' })
@ApiTags('activity')
export class ActivityController {
  constructor(private activityService: ActivityService) {}

  @Get('/list/suggestions/channels')
  @ApiOkResponse({
    description: 'User gets public channel suggestions',
    type: PublicChannelSuggestionListResponse,
  })
  @IsAuthenticated()
  getPublicChannels(
    @Query() query: PaginationQuery,
    @CurrentUser() user: UserTokenPayload,
  ) {
    return this.activityService.getPublicChannelSuggestions(user.id, query);
  }

  @Get('/list/suggestions/zone')
  @ApiOkResponse({
    description: 'User gets public zone suggestions',
    type: PublicZoneSuggestionListResponse,
  })
  @IsAuthenticated()
  getPublicZones(
    @Query() query: PaginationQuery,
    @CurrentUser() user: UserTokenPayload,
  ) {
    return this.activityService.getPublicZoneSuggestions(user.id, query);
  }

  // TODO api ok response revision
  @Get('/list/suggestions/contact')
  @IsAuthenticated()
  getContactSuggestions(@CurrentUser() user: UserTokenPayload) {
    return this.activityService.getContactSuggestions(user.id);
  }

  @Get('/list/notifications')
  @IsAuthenticated()
  getUserNotifications(
    @CurrentUser() user: UserTokenPayload,
    @Query() query: PaginationQuery,
  ) {
    return this.activityService.getNotifications(user.id, query);
  }

  @Post('/mark/notification')
  @IsAuthenticated()
  markNotificationAsRead(
    @Body() info: MarkNotificationDto,
    @CurrentUser() user: UserTokenPayload,
  ) {
    if (info.notificationId)
      return this.activityService.markNotificationAsRead(
        user.id,
        info.notificationId,
      );

    return this.activityService.markAllNotificationsAsRead(user.id);
  }
}

import { Controller, Get, Query } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { UserChannel } from 'entities/UserChannel.entity';
import { UserZone } from 'entities/UserZone.entity';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserPayload } from 'src/auth/interfaces/user.interface';
import { CurrentUserChannel } from 'src/channel/decorators/current-user-channel.decorator';
import { UserChannelRole } from 'src/channel/decorators/user-channel-role.decorator';
import { PaginationQueryParams } from 'src/utils/decorators/pagination-query-params.decorator';
import { CurrentUserZone } from 'src/zone/decorators/current-user-zone.decorator';
import { UserZoneRole } from 'src/zone/decorators/user-zone-role.decorator';
import { PaginationQuery } from 'types/PaginationQuery';
import { ActivityService } from './activity.service';

@Controller({ path: 'activity', version: '1' })
@ApiTags('activity')
export class ActivityController {
  constructor(private activityService: ActivityService) {}

  @Get('/list/suggestions/channels')
  @IsAuthenticated()
  @PaginationQueryParams()
  getPublicChannels(
    @Query() query: PaginationQuery,
    @CurrentUser() user: UserPayload,
  ) {
    return this.activityService.getPublicChannelSuggestions(user.id, query);
  }

  @Get('/list/suggestions/zone')
  @IsAuthenticated()
  @PaginationQueryParams()
  getPublicZones(
    @Query() query: PaginationQuery,
    @CurrentUser() user: UserPayload,
  ) {
    return this.activityService.getPublicZoneSuggestions(user.id, query);
  }

  @Get('/list/feed/public')
  @IsAuthenticated()
  @PaginationQueryParams()
  getPublicFeed(@Query() query: PaginationQuery) {
    return this.activityService.getPublicFeed(query);
  }

  @Get('/list/feed/user')
  @IsAuthenticated()
  @PaginationQueryParams()
  getUserFeed(
    @Query() query: PaginationQuery,
    @CurrentUser() user: UserPayload,
  ) {
    return this.activityService.getUserFeed(user.id, query);
  }

  @Get('/list/feed/zone/:zoneId')
  @UserZoneRole()
  @ApiParam({
    name: 'zoneId',
    type: Number,
  })
  @PaginationQueryParams()
  getZoneFeed(
    @Query() query: PaginationQuery,
    @CurrentUserZone() userZone: UserZone,
  ) {
    return this.activityService.getZoneFeed(userZone.zoneId, query);
  }

  @Get('/list/feed/channel/:channelId')
  @UserChannelRole()
  @ApiParam({
    name: 'channelId',
    type: Number,
  })
  @PaginationQueryParams()
  getChannelFeed(
    @Query() query: PaginationQuery,
    @CurrentUserChannel() userChannel: UserChannel,
  ) {
    return this.activityService.getChannelFeed(userChannel.channelId, query);
  }
}

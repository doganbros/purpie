import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
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
import {
  MixedActivityFeedListResponse,
  PublicActivityFeedListResponse,
  PublicChannelSuggestionListResponse,
  PublicZoneSuggestionListResponse,
} from './activity.response';
import { ActivityService } from './activity.service';

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
  @PaginationQueryParams()
  getPublicChannels(
    @Query() query: PaginationQuery,
    @CurrentUser() user: UserPayload,
  ) {
    return this.activityService.getPublicChannelSuggestions(user.id, query);
  }

  @Get('/list/suggestions/zone')
  @ApiOkResponse({
    description: 'User gets public zone suggestions',
    type: PublicZoneSuggestionListResponse,
  })
  @IsAuthenticated()
  @PaginationQueryParams()
  getPublicZones(
    @Query() query: PaginationQuery,
    @CurrentUser() user: UserPayload,
  ) {
    return this.activityService.getPublicZoneSuggestions(user.id, query);
  }

  @Get('/list/feed/public')
  @ApiOkResponse({
    description: 'User gets public feed',
    type: PublicActivityFeedListResponse,
  })
  @IsAuthenticated()
  @PaginationQueryParams()
  getPublicFeed(@Query() query: PaginationQuery) {
    return this.activityService.getPublicFeed(query);
  }

  @Get('/list/feed/user')
  @ApiOkResponse({
    description: 'User gets main feed from channels and from contacts',
    type: MixedActivityFeedListResponse,
  })
  @IsAuthenticated()
  @PaginationQueryParams()
  getUserFeed(
    @Query() query: PaginationQuery,
    @CurrentUser() user: UserPayload,
  ) {
    return this.activityService.getUserFeed(user.id, query);
  }

  @Get('/list/feed/zone/:zoneId')
  @ApiOkResponse({
    description: 'User gets feed for a zone from channels of this zone',
    type: MixedActivityFeedListResponse,
  })
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
  @ApiOkResponse({
    description: 'User gets feed for this zone',
    type: MixedActivityFeedListResponse,
  })
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

import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserPayload } from 'src/auth/interfaces/user.interface';
import { PaginationQueryParams } from 'src/utils/decorators/pagination-query-params.decorator';
import { PaginationQuery } from 'types/PaginationQuery';
import {
  MixedActivityFeedDetail,
  MixedActivityFeedListResponse,
  PublicActivityFeedListResponse,
  PublicChannelSuggestionListResponse,
  PublicZoneSuggestionListResponse,
} from './activity.response';
import { ActivityService } from './activity.service';
import { ActivityListDecorator } from './decorator/activity-list.decorator';

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
  @ActivityListDecorator()
  @ApiOkResponse({
    description: 'User gets public feed',
    type: PublicActivityFeedListResponse,
  })
  @IsAuthenticated()
  @PaginationQueryParams()
  getPublicFeed(
    @Query() query: PaginationQuery,
    @CurrentUser() user: UserPayload,
  ) {
    return this.activityService.getPublicFeed(query, user.id);
  }

  @Get('/list/feed/user')
  @ActivityListDecorator()
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
  @ActivityListDecorator()
  @ApiOkResponse({
    description: 'User gets feed for a zone from channels of this zone',
    type: MixedActivityFeedListResponse,
  })
  @IsAuthenticated()
  @ApiParam({
    name: 'zoneId',
    type: Number,
  })
  @PaginationQueryParams()
  getZoneFeed(
    @Query() query: PaginationQuery,
    @CurrentUser() user: UserPayload,
    @Param('zoneId') zoneId: string,
  ) {
    return this.activityService.getZoneFeed(
      Number.parseInt(zoneId, 10),
      user.id,
      query,
    );
  }

  @Get('/list/feed/channel/:channelId')
  @ActivityListDecorator()
  @ApiOkResponse({
    description: 'User gets feed for this channel',
    type: MixedActivityFeedListResponse,
  })
  @IsAuthenticated()
  @ApiParam({
    name: 'channelId',
    type: Number,
  })
  @PaginationQueryParams()
  getChannelFeed(
    @Query() query: PaginationQuery,
    @CurrentUser() user: UserPayload,
    @Param('channelId') channelId: string,
  ) {
    return this.activityService.getChannelFeed(
      Number.parseInt(channelId, 10),
      user.id,
      query,
    );
  }

  @Get('/detail/feed/:postId')
  @ApiOkResponse({
    description: 'User gets post by id',
    type: MixedActivityFeedDetail,
  })
  @IsAuthenticated()
  @ApiParam({
    name: 'postId',
    type: Number,
  })
  async getFeedById(
    @Param('postId') postId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const result = await this.activityService.getPostById(
      user.id,
      Number(postId),
    );

    if (!result)
      throw new NotFoundException('Post not found', 'POST_NOT_FOUND');

    return result;
  }
}

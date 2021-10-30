import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserPayload } from 'src/auth/interfaces/user.interface';
import { PaginationQueryParams } from 'src/utils/decorators/pagination-query-params.decorator';
import { PaginationQuery } from 'types/PaginationQuery';
import {
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
}

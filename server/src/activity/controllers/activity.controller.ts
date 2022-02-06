import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserTokenPayload } from 'src/auth/interfaces/user.interface';
import { PaginationQuery } from 'types/PaginationQuery';
import {
  PublicChannelSuggestionListResponse,
  PublicZoneSuggestionListResponse,
} from '../activity.response';
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
}

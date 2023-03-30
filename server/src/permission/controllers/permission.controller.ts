import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PermissionService } from '../services/permission.service';

@Controller({ path: 'permission', version: '1' })
@ApiTags('permission')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  // @Get('')
  // @ApiOkResponse({
  //   description: 'User gets public channel suggestions',
  //   type: PublicChannelSuggestionListResponse,
  // })
  // @IsAuthenticated()
  // getPublicChannels(
  //   @Query() query: PaginationQuery,
  //   @CurrentUser() user: UserTokenPayload,
  // ) {
  //   return this.activityService.li(user.id, query);
  // }
}

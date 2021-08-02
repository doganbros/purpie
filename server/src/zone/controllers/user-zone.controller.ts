import {
  Controller,
  Get,
  Query,
  Delete,
  ForbiddenException,
} from '@nestjs/common';
import { ApiHeader, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { User } from 'entities/User.entity';
import { UserZone } from 'entities/UserZone.entity';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserPayload } from 'src/auth/interfaces/user.interface';
import { PaginationQueryParams } from 'src/utils/decorators/pagination-query-params.decorator';
import { PaginationQuery } from 'types/PaginationQuery';
import { CurrentUserZone } from '../decorators/current-user-zone.decorator';
import { UserZoneRole } from '../decorators/user-zone-role.decorator';
import { ZoneService } from '../zone.service';

@Controller({ path: 'user-zone', version: '1' })
@ApiTags('user-zone')
export class UserZoneController {
  constructor(private zoneService: ZoneService) {}

  @Get()
  @ApiOkResponse({
    description: "Get the list of current user's zones",
  })
  @PaginationQueryParams()
  @IsAuthenticated()
  @ApiHeader({
    name: 'app-subdomain',
    required: false,
    description: 'Zone subdomain',
  })
  async getCurrentUserZones(
    @CurrentUser() user: UserPayload,
    @Query() paginatedQuery: PaginationQuery,
  ) {
    return this.zoneService.getCurrentUserZones(user, paginatedQuery);
  }

  @Get('/:userZoneId')
  @ApiParam({
    name: 'userZoneId',
    description: 'User Zone Id',
  })
  @UserZoneRole()
  async getUserZoneById(@CurrentUserZone() currentUserZone: UserZone) {
    return currentUserZone;
  }

  @Delete('/:userZoneId')
  @ApiParam({
    name: 'userZoneId',
    description: 'User Zone Id',
  })
  @UserZoneRole()
  async deleteUserZoneById(
    @CurrentUserZone() currentUserZone: UserZone,
    @CurrentUser() currentUser: User,
  ) {
    if (
      currentUserZone.zone.defaultZone &&
      currentUserZone.userId === currentUser.id
    )
      throw new ForbiddenException(
        'Cannot remove yourself from your default zone',
        'CANNOT_REMOVE_YOURSELF_DEFAULT_ZONE',
      );
    await currentUserZone.remove();
    return 'OK';
  }
}

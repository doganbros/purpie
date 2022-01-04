import {
  Controller,
  Get,
  Delete,
  HttpCode,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import { ApiHeader, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

import { UserZone } from 'entities/UserZone.entity';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserPayload } from 'src/auth/interfaces/user.interface';
import { CurrentUserZone } from '../decorators/current-user-zone.decorator';
import { UserZoneRole } from '../decorators/user-zone-role.decorator';
import {
  UserZoneListResponse,
  UserZoneDetailResponse,
} from '../responses/user-zone.response';
import { ZoneService } from '../zone.service';

@Controller({ path: 'user-zone', version: '1' })
@ApiTags('user-zone')
export class UserZoneController {
  constructor(private zoneService: ZoneService) {}

  @Get('list')
  @ApiOkResponse({
    type: UserZoneListResponse,
    isArray: true,
    description:
      "Get the list of current user's zones. It also adds the public zone which is selected but not joined yet, Its userzoneId will be null when the user zone is not found",
  })
  @ApiHeader({
    name: 'app-subdomain',
    required: false,
    description: 'Zone subdomain',
  })
  @IsAuthenticated()
  async getCurrentUserZones(
    @CurrentUser() user: UserPayload,
    @Headers('app-subdomain') subdomain?: string,
  ) {
    return this.zoneService.getCurrentUserZones(user, subdomain);
  }

  @Get('detail')
  @ApiOkResponse({
    type: UserZoneDetailResponse,
    description:
      "Get current user's zone detail, This is deduced from the current subdomain",
  })
  @ApiParam({
    name: 'userZoneId',
    description: 'User Zone Id',
  })
  @ApiHeader({
    name: 'app-subdomain',
    required: true,
    description: 'Zone subdomain',
  })
  @UserZoneRole()
  async getCurrentUserZone(@CurrentUserZone() currentUserZone: UserZone) {
    return currentUserZone;
  }

  @Get('detail/:userZoneId')
  @ApiOkResponse({
    type: UserZoneDetailResponse,
    description: 'Get user zone detail by user zone id',
  })
  @ApiParam({
    name: 'userZoneId',
    description: 'User Zone Id',
  })
  @UserZoneRole()
  async getUserZoneById(@CurrentUserZone() currentUserZone: UserZone) {
    return currentUserZone;
  }

  @Delete('remove/:userZoneId')
  @ApiOkResponse({
    schema: { type: 'string', example: 'OK' },
  })
  @ApiParam({
    name: 'userZoneId',
    description: 'User Zone Id',
  })
  @HttpCode(HttpStatus.OK)
  @UserZoneRole()
  async deleteUserZoneById(@CurrentUserZone() currentUserZone: UserZone) {
    await currentUserZone.remove();
    return 'OK';
  }
}

import {
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { UserZone } from 'entities/UserZone.entity';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserTokenPayload } from 'src/auth/interfaces/user.interface';
import { CurrentUserZone } from '../decorators/current-user-zone.decorator';
import { UserZoneRole } from '../decorators/user-zone-role.decorator';
import {
  UserZoneDetailResponse,
  UserZoneListResponse,
} from '../responses/user-zone.response';
import { UserZoneService } from '../services/user-zone.service';
import { errorResponseDoc } from '../../../helpers/error-response-doc';

@Controller({ path: 'user-zone', version: '1' })
@ApiTags('User Zone')
export class UserZoneController {
  constructor(private userZoneService: UserZoneService) {}

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
    @CurrentUser() user: UserTokenPayload,
    @Headers('app-subdomain') subdomain?: string,
  ) {
    return this.userZoneService.getCurrentUserZones(user.id, subdomain);
  }

  @Get('detail')
  @ApiOkResponse({
    type: UserZoneDetailResponse,
    description:
      "Get current user's zone detail, This is deduced from the current subdomain",
  })
  @ApiNotFoundResponse({
    description: 'Error thrown when the user zone ist not found',
    schema: errorResponseDoc(404, 'User Zone not found', 'ZONE_NOT_FOUND'),
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

  @Delete('remove/:zoneId')
  @ApiOkResponse({
    schema: { type: 'string', example: 'OK' },
  })
  @ApiParam({
    name: 'zoneId',
    description: 'Zone Id',
  })
  @HttpCode(HttpStatus.OK)
  @UserZoneRole()
  async deleteUserZoneByZoneId(@CurrentUserZone() currentUserZone: UserZone) {
    await currentUserZone.remove();
    return 'OK';
  }
}

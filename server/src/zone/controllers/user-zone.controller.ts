import { Controller, Get, Delete } from '@nestjs/common';
import { ApiHeader, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

import { UserZone } from 'entities/UserZone.entity';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserPayload } from 'src/auth/interfaces/user.interface';
import { CurrentUserZone } from '../decorators/current-user-zone.decorator';
import { UserZoneRole } from '../decorators/user-zone-role.decorator';
import { ZoneService } from '../zone.service';

@Controller({ path: 'user-zone', version: '1' })
@ApiTags('user-zone')
export class UserZoneController {
  constructor(private zoneService: ZoneService) {}

  @Get('list')
  @ApiOkResponse({
    description: "Get the list of current user's zones",
  })
  @IsAuthenticated()
  async getCurrentUserZones(@CurrentUser() user: UserPayload) {
    return this.zoneService.getCurrentUserZones(user);
  }

  @Get('detail')
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
  @ApiParam({
    name: 'userZoneId',
    description: 'User Zone Id',
  })
  @UserZoneRole()
  async getUserZoneById(@CurrentUserZone() currentUserZone: UserZone) {
    return currentUserZone;
  }

  @Delete('remove/:userZoneId')
  @ApiParam({
    name: 'userZoneId',
    description: 'User Zone Id',
  })
  @UserZoneRole()
  async deleteUserZoneById(@CurrentUserZone() currentUserZone: UserZone) {
    await currentUserZone.remove();
    return 'OK';
  }
}

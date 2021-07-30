import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Delete,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UserZone } from 'entities/UserZone.entity';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserPayload } from 'src/auth/interfaces/user.interface';
import { PaginationQueryParams } from 'src/utils/decorators/pagination-query-params.decorator';
import { PaginationQuery } from 'types/PaginationQuery';
import { CurrentUserZone } from '../decorators/current-user-zone.decorator';
import { UserZoneRole } from '../decorators/user-zone-role.decorator';
import { CreateZoneDto } from '../dto/create-zone.dto';
import { ZoneService } from '../zone.service';

@Controller({ path: 'user-zone', version: '1' })
@ApiTags('user-zone')
export class UserZoneController {
  constructor(private zoneService: ZoneService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Current authenticated user adds a new zone.',
  })
  @IsAuthenticated(['canCreateZone'])
  async createZone(
    @Body() createZoneInfo: CreateZoneDto,
    @CurrentUser() currentUser: UserPayload,
  ) {
    const userZone = await this.zoneService.createZone(
      currentUser.id,
      createZoneInfo,
    );

    this.zoneService.sendZoneInfoMail(userZone.zone, currentUser);

    return userZone;
  }

  @Post('/defaults')
  @ApiCreatedResponse({
    description:
      'Current authenticated user creates a default zone and channel',
  })
  @IsAuthenticated()
  async createDefaultZoneAndChannel(
    @Body() createZoneInfo: CreateZoneDto,
    @CurrentUser() currentUser: UserPayload,
  ) {
    const hasDefaults = await this.zoneService.userHasDefaultZoneAndChannel(
      currentUser.id,
    );

    if (hasDefaults)
      throw new ForbiddenException(
        'Current User already has a default zone and channel',
      );

    const {
      userZone,
      userChannel,
    } = await this.zoneService.createDefaultZoneAndChannel(
      currentUser.id,
      createZoneInfo,
    );

    this.zoneService.sendZoneInfoMail(userZone.zone, currentUser);

    return {
      userZone,
      userChannel,
    };
  }

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
  async deleteUserZoneById(@CurrentUserZone() currentUserZone: UserZone) {
    await currentUserZone.remove();
    return 'OK';
  }
}

import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Headers,
  Delete,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { PaginationQuery } from 'types/PaginationQuery';
import { UserPayloadRequest } from 'types/UserPayloadRequest';
import { UserZoneRequest } from 'types/UserZoneRequest';
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
  @IsAuthenticated()
  async createZone(
    @Body() createZoneInfo: CreateZoneDto,
    @Req() req: UserPayloadRequest,
  ) {
    const userZone = await this.zoneService.createZone(
      req.user.id,
      createZoneInfo,
    );

    this.zoneService.sendZoneInfoMail(userZone.zone, req.user);

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
    @Req() req: UserPayloadRequest,
  ) {
    const hasDefaults = await this.zoneService.userHasDefaultZoneAndChannel(
      req.user.id,
    );

    if (hasDefaults)
      throw new ForbiddenException(
        'Current User already has a default zone and channel',
      );

    const {
      userZone,
      userChannel,
    } = await this.zoneService.createDefaultZoneAndChannel(
      req.user.id,
      createZoneInfo,
    );

    this.zoneService.sendZoneInfoMail(userZone.zone, req.user);

    return {
      userZone,
      userChannel,
    };
  }

  @Get()
  @ApiOkResponse({
    description: "Get the list of current user's zones",
  })
  @ApiQuery({
    name: 'limit',
    description: 'The number of zones to get. Defaults to 30',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'skip',
    description: 'The number of zones to skip. Defaults to 0',
    type: Number,
    required: false,
  })
  @IsAuthenticated()
  @ApiHeader({
    name: 'app-subdomain',
    required: false,
    description: 'Zone subdomain',
  })
  async getCurrentUserZones(
    @Req() req: UserPayloadRequest,
    @Query() paginatedQuery: PaginationQuery,
    @Headers('app-subdomain') subdomain: string,
  ) {
    const result = await this.zoneService.getCurrentUserZones(
      req.user,
      paginatedQuery,
    );
    return {
      ...result,
      currentSubDomain: subdomain,
    };
  }

  @Get('/:userZoneId')
  @ApiParam({
    name: 'userZoneId',
    description: 'User Zone Id',
  })
  @UserZoneRole()
  async getUserZoneById(@Req() req: UserZoneRequest) {
    return req.userZone;
  }

  @Delete('/:userZoneId')
  @ApiParam({
    name: 'userZoneId',
    description: 'User Zone Id',
  })
  @UserZoneRole()
  async deleteUserZoneById(@Req() req: UserZoneRequest) {
    await req.userZone.remove();
    return 'OK';
  }
}

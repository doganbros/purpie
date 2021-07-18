import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Headers,
  UseGuards,
  Delete,
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
import { CreateZoneDto } from '../dto/create-zone.dto';
import { UserZoneGuard } from '../guards/user-zone.guard';
import { ZoneService } from '../zone.service';

@Controller({ path: 'user-zone', version: '1' })
@ApiTags('user-zone')
export class UserZoneController {
  constructor(private zoneService: ZoneService) {}

  @Post()
  @ApiCreatedResponse({
    description: `Current authenticated user adds a new zone.`,
  })
  @IsAuthenticated()
  async createZone(
    @Body() createZoneInfo: CreateZoneDto,
    @Req() req: UserPayloadRequest,
  ) {
    const zone = await this.zoneService.createZone(req.user.id, createZoneInfo);

    this.zoneService.sendZoneInfoMail(zone, req.user);

    return {
      name: zone.name,
      subdomain: zone.subdomain,
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

  @Get('/:id')
  @ApiParam({
    name: 'id',
    description: 'User Zone Id',
  })
  @IsAuthenticated()
  @UseGuards(UserZoneGuard)
  async getUserZoneById(@Req() req: UserZoneRequest) {
    return req.userZone;
  }

  @Delete('/:id')
  @ApiParam({
    name: 'id',
    description: 'User Zone Id',
  })
  @IsAuthenticated()
  @UseGuards(UserZoneGuard)
  async deleteUserZoneById(@Req() req: UserZoneRequest) {
    await req.userZone.remove();
    return 'OK';
  }
}

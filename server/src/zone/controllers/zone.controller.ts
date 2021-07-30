import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserZone } from 'entities/UserZone.entity';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'entities/User.entity';
import { UserPayload } from 'src/auth/interfaces/user.interface';
import { CurrentUserZone } from '../decorators/current-user-zone.decorator';
import { UserZoneRole } from '../decorators/user-zone-role.decorator';
import { InviteToJoinDto } from '../dto/invite-to-join.dto';
import { InvitationResponseDto } from '../dto/invitation-response.dto';
import { ZoneIdParams } from '../dto/zone-id.params';
import { ZoneService } from '../zone.service';
import { EditZoneDto } from '../dto/edit-zone.dto';
import { CreateZoneDto } from '../dto/create-zone.dto';

@Controller('zone')
@ApiTags('zone')
export class ZoneController {
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

  @Post('/join/:zoneId')
  @IsAuthenticated()
  async joinPublicZone(
    @CurrentUser() user: UserPayload,
    @Param() { zoneId }: ZoneIdParams,
  ) {
    const zone = await this.zoneService.validateJoinPublicZone(user.id, zoneId);

    if (!zone) throw new NotFoundException('Zone not found', 'ZONE_NOT_FOUND');

    const userZone = await this.zoneService.addUserToZone(user.id, zoneId);

    this.zoneService.removeInvitation(user.email, zone.id);
    return userZone;
  }

  @Get('/categories')
  async getParentCategories() {
    return this.zoneService.getCategories();
  }

  @Get('/categories/:zoneId')
  @ApiParam({
    name: 'zoneId',
    description: 'The zone id',
  })
  @UserZoneRole()
  async getZoneCategories(@CurrentUserZone() currentUserZone: UserZone) {
    return this.zoneService.getCategories(currentUserZone.zone.categoryId);
  }

  @Post('/invite/:zoneId')
  @UserZoneRole(['canInvite'])
  async inviteToJoinZone(
    @Param() { zoneId }: ZoneIdParams,
    @Body() { email }: InviteToJoinDto,
    @CurrentUserZone() currentUserZone: UserZone,
    @CurrentUser() user: User,
  ) {
    const zone = await this.zoneService.validateInviteUser(email, zoneId);

    if (!zone) throw new NotFoundException('Zone not found', 'ZONE_NOT_FOUND');

    const invitation = await this.zoneService.addUserToZoneInvitation(
      email,
      zoneId,
      user.id,
    );

    this.zoneService.sendZoneInvitationMail(currentUserZone.zone, email);

    return invitation;
  }

  @Post('/invitation/response')
  @IsAuthenticated()
  async respondToInvitationToJoinZone(
    @Body() invitationResponse: InvitationResponseDto,
    @CurrentUser() currentUser: UserPayload,
  ) {
    const invitation = await this.zoneService.validateInvitationResponse(
      invitationResponse.invitationId,
      currentUser.email,
    );

    if (!invitation) throw new NotFoundException('Invitation not found');

    if (invitationResponse.status === 'reject') {
      invitation.remove();
      return 'OK';
    }

    const userZone = await this.zoneService.addUserToZone(
      currentUser.id,
      invitation.zoneId,
    );

    await invitation.remove();
    return userZone;
  }

  @Delete('/:zoneId')
  @ApiParam({
    name: 'zoneId',
    description: 'The zone id',
  })
  @UserZoneRole(['canDelete'])
  async deleteZone(@CurrentUserZone() userZone: UserZone) {
    if (userZone.zone.defaultZone)
      throw new ForbiddenException(
        'Cannot delete default zone',
        'CANNOT_DELETE_DEFAULT_ZONE',
      );

    return this.zoneService.deleteZoneById(userZone.zone.id);
  }

  @Put('/:zoneId')
  @ApiParam({
    name: 'zoneId',
    description: 'The zone id',
  })
  @UserZoneRole(['canEdit'])
  async editZone(
    @CurrentUserZone() userZone: UserZone,
    @Body() editInfo: EditZoneDto,
  ) {
    return this.zoneService.editZoneById(userZone.zone.id, editInfo);
  }
}

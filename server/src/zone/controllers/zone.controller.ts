import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserZone } from 'entities/UserZone.entity';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserPayload } from 'src/auth/interfaces/user.interface';
import { CurrentUserZone } from '../decorators/current-user-zone.decorator';
import { UserZoneRole } from '../decorators/user-zone-role.decorator';
import { InviteToJoinDto } from '../dto/invite-to-join.dto';
import { InvitationResponseDto } from '../dto/invitation-response.dto';
import { ZoneIdParams } from '../dto/zone-id.params';
import { ZoneService } from '../zone.service';

@Controller('zone')
@ApiTags('zone')
export class ZoneController {
  constructor(private zoneService: ZoneService) {}

  @Get('/ci-test')
  async ciTest() {
    return 'It works';
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

    return userZone;
  }

  @Post('/invite/:zoneId')
  @UserZoneRole(['canInvite'])
  async inviteToJoinZone(
    @Param() { zoneId }: ZoneIdParams,
    @Body() { email }: InviteToJoinDto,
    @CurrentUserZone() currentUserZone: UserZone,
  ) {
    const zone = await this.zoneService.validateInviteUser(email, zoneId);

    if (!zone) throw new NotFoundException('Zone not found', 'ZONE_NOT_FOUND');

    const invitation = await this.zoneService.addUserToZoneInvitation(
      email,
      zoneId,
    );

    this.zoneService.sendZoneInvitationMail(currentUserZone.zone, email);

    return invitation;
  }

  @Post('/invitation-response')
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
}

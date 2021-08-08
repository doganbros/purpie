import {
  Post,
  Controller,
  Param,
  NotFoundException,
  Body,
  Delete,
  Put,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { User } from 'entities/User.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { UserZone } from 'entities/UserZone.entity';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserPayload } from 'src/auth/interfaces/user.interface';
import { CurrentUserZone } from 'src/zone/decorators/current-user-zone.decorator';
import { UserZoneRole } from 'src/zone/decorators/user-zone-role.decorator';
import { InvitationResponseDto } from 'src/zone/dto/invitation-response.dto';
import { ZoneService } from 'src/zone/zone.service';
import { ChannelService } from '../channel.service';
import { CurrentUserChannel } from '../decorators/current-user-channel.decorator';
import { UserChannelRole } from '../decorators/user-channel-role.decorator';
import { ChannelIdParams } from '../dto/channel-id.params';
import { CreateChannelDto } from '../dto/create-channel.dto';
import { EditChannelDto } from '../dto/edit-channel.dto';
import { InviteToJoinChannelDto } from '../dto/invite-to-join-channel.dto';

@Controller({ path: 'channel', version: '1' })
@ApiTags('channel')
export class ChannelController {
  constructor(
    private channelService: ChannelService,
    private zoneService: ZoneService,
  ) {}

  @Post('/create/:userZoneId')
  @ApiCreatedResponse({
    description: 'Current authenticated user adds a new channel to a zone',
  })
  @ApiParam({
    name: 'userZoneId',
    description: 'user zone id',
  })
  @UserZoneRole(['canCreateChannel'])
  async createNewChannel(
    @Body() createChannelInfo: CreateChannelDto,
    @CurrentUser() currentUser: UserPayload,
    @CurrentUserZone() currentUserZone: UserZone,
  ) {
    const userChannel = await this.channelService.createChannel(
      currentUser.id,
      currentUserZone.zone.id,
      createChannelInfo,
    );

    this.channelService.sendChannelInfo(
      currentUserZone.zone,
      userChannel.channel,
      currentUser,
    );

    return userChannel;
  }

  @Post('/join/:channelId')
  @IsAuthenticated()
  async joinPublicZone(
    @CurrentUser() user: UserPayload,
    @Param() { channelId }: ChannelIdParams,
  ) {
    const channel = await this.channelService.validateJoinPublicChannel(
      user.id,
      channelId,
    );

    if (!channel)
      throw new NotFoundException('Channel not found', 'CHANNEL_NOT_FOUND');

    const userZone = await this.zoneService.userExistsInZone(
      user.id,
      channel.zoneId,
    );

    if (!userZone)
      await this.zoneService.addUserToZone(user.id, channel.zoneId);

    const userChannel = await this.channelService.addUserToChannel(
      user.id,
      channel.id,
    );
    await this.channelService.removeInvitation(user.email, channel.id);

    return userChannel;
  }

  @Post('/invite/:channelId')
  @UserChannelRole(['canInvite'])
  async inviteToJoinZone(
    @Param() { channelId }: ChannelIdParams,
    @Body() { email }: InviteToJoinChannelDto,
    @CurrentUserChannel() currentUserChannel: UserChannel,
    @CurrentUser() currentUser: User,
  ) {
    const channel = await this.channelService.validateInviteUser(
      email,
      channelId,
    );

    if (!channel)
      throw new NotFoundException('Channel not found', 'CHANNEL_NOT_FOUND');

    const invitation = await this.channelService.addUserToChannelInvitation(
      email,
      channelId,
      currentUser.id,
    );

    this.channelService.sendChannelInvitationMail(
      currentUserChannel.channel,
      email,
    );

    return invitation;
  }

  @Post('/invitation/response')
  @IsAuthenticated()
  async respondToInvitationToJoinZone(
    @Body() invitationResponse: InvitationResponseDto,
    @CurrentUser() currentUser: UserPayload,
  ) {
    const invitation = await this.channelService.validateInvitationResponse(
      invitationResponse.invitationId,
      currentUser.email,
    );

    if (!invitation) throw new NotFoundException('Invitation not found');

    if (invitationResponse.status === 'reject') {
      invitation.remove();
      return 'OK';
    }

    const userZone = await this.zoneService.userExistsInZone(
      currentUser.id,
      invitation.channel.zoneId,
    );

    if (!userZone)
      await this.zoneService.addUserToZone(
        currentUser.id,
        invitation.channel.zoneId,
      );

    const userChannel = await this.channelService.addUserToChannel(
      currentUser.id,
      invitation.channelId,
    );

    await invitation.remove();
    return userChannel;
  }

  @Delete('/remove/:channelId')
  @ApiParam({
    name: 'channelId',
    description: 'The channel id',
  })
  @UserChannelRole(['canDelete'])
  async deleteZone(@CurrentUserChannel() userChannel: UserChannel) {
    return this.channelService.deleteByChannelId(userChannel.channel.id);
  }

  @Put('/update/:channelId')
  @ApiParam({
    name: 'channelId',
    description: 'The channel id',
  })
  @UserChannelRole(['canEdit'])
  async editChannel(
    @CurrentUserChannel() userChannel: UserChannel,
    @Body() editInfo: EditChannelDto,
  ) {
    return this.channelService.editChannelById(
      userChannel.channel.id,
      editInfo,
    );
  }
}

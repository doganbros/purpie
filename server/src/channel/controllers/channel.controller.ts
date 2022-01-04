import {
  Post,
  Controller,
  Param,
  NotFoundException,
  Body,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'entities/User.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { UserZone } from 'entities/UserZone.entity';
import { errorResponseDoc } from 'helpers/error-response-doc';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserPayload } from 'src/auth/interfaces/user.interface';
import { ValidationBadRequest } from 'src/utils/decorators/validation-bad-request.decorator';
import { CurrentUserZone } from 'src/zone/decorators/current-user-zone.decorator';
import { UserZoneRole } from 'src/zone/decorators/user-zone-role.decorator';
import { InvitationResponseDto } from 'src/zone/dto/invitation-response.dto';
import { ZoneService } from 'src/zone/zone.service';
import { ChannelService } from '../channel.service';
import { CurrentUserChannel } from '../decorators/current-user-channel.decorator';
import { UserChannelRole } from '../decorators/user-channel-role.decorator';
import { CreateChannelDto } from '../dto/create-channel.dto';
import { EditChannelDto } from '../dto/edit-channel.dto';
import { InviteToJoinChannelDto } from '../dto/invite-to-join-channel.dto';
import { SearchChannelQuery } from '../dto/search-channel.query';

@Controller({ path: 'channel', version: '1' })
@ApiTags('channel')
export class ChannelController {
  constructor(
    private channelService: ChannelService,
    private zoneService: ZoneService,
  ) {}

  @Post('/create/:userZoneId')
  @ApiCreatedResponse({
    description:
      'Current authenticated user adds a new channel to a zone. User channel id is returned. User channel must have canCreateChannel permission',
    schema: { type: 'integer' },
  })
  @ValidationBadRequest()
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
      currentUserZone.id,
      currentUserZone.zone.id,
      createChannelInfo,
    );

    this.channelService.sendChannelInfo(
      currentUserZone.zone,
      userChannel.channel,
      currentUser,
    );

    return userChannel.id;
  }

  @Get('/search')
  @IsAuthenticated()
  searchChannel(
    @Query() query: SearchChannelQuery,
    @CurrentUser() user: UserPayload,
  ) {
    return this.channelService.searchChannel(user, query);
  }

  @Get('/list/public/:zoneId')
  @IsAuthenticated()
  async listPublicChannelsByZoneId(
    @Param('zoneId', ParseIntPipe) zoneId: number,
    @CurrentUser() user: UserPayload,
  ) {
    return this.channelService.getPublicChannels(user.id, zoneId);
  }

  @Post('/join/:channelId')
  @ApiCreatedResponse({
    description:
      "Current authenticated user joins a public channel. When the user doesn't belong to the zone he is added. The id of the user channel is returned",
    schema: { type: 'integer' },
  })
  @IsAuthenticated()
  async joinPublicChannel(
    @CurrentUser() user: UserPayload,
    @Param('channelId', ParseIntPipe) channelId: number,
  ) {
    const channel = await this.channelService.validateJoinPublicChannel(
      user.id,
      channelId,
    );

    if (!channel)
      throw new NotFoundException('Channel not found', 'CHANNEL_NOT_FOUND');

    let userZone = await this.zoneService.userExistsInZone(
      user.id,
      channel.zoneId,
    );

    if (!userZone)
      userZone = await this.zoneService.addUserToZone(user.id, channel.zoneId);

    const userChannel = await this.channelService.addUserToChannel(
      user.id,
      userZone.id,
      channel.id,
    );
    await this.channelService.removeInvitation(user.email, channel.id);

    return userChannel.id;
  }

  @Post('/invite/:channelId')
  @UserChannelRole(['canInvite'])
  @ApiCreatedResponse({
    description:
      'Current authenticated channel member invites a user to this channel. The id of the invitation is returned. User channel must have canInvite permission',
    schema: { type: 'integer' },
  })
  @ApiNotFoundResponse({
    description:
      'Error thrown when the user is not eligible for the channel or the channel is not found',
    schema: errorResponseDoc(404, 'Channel not found', 'CHANNEL_NOT_FOUND'),
  })
  @ApiBadRequestResponse({
    description: 'Error thrown when the user is already invited',
    schema: errorResponseDoc(
      400,
      `The user with the email '<email>' has already been invited to this channel`,
      'USER_ALREADY_INVITED_TO_CHANNEL',
    ),
  })
  @ValidationBadRequest()
  async inviteToJoinChannel(
    @Param('channelId', ParseIntPipe) channelId: number,
    @Body() { email }: InviteToJoinChannelDto,
    @CurrentUserChannel() currentUserChannel: UserChannel,
    @CurrentUser() currentUser: User,
  ) {
    await this.channelService.validateInviteUser(email, channelId);

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
  @ValidationBadRequest()
  @ApiCreatedResponse({
    description: 'User Responds to invitation',
    schema: { type: 'string', example: 'OK' },
  })
  @IsAuthenticated()
  async respondToInvitationToJoinChannel(
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

    let userZone = await this.zoneService.userExistsInZone(
      currentUser.id,
      invitation.channel.zoneId,
    );

    if (!userZone)
      userZone = await this.zoneService.addUserToZone(
        currentUser.id,
        invitation.channel.zoneId,
      );

    await this.channelService.addUserToChannel(
      currentUser.id,
      userZone.id,
      invitation.channelId,
    );

    await invitation.remove();
    return 'OK';
  }

  @Delete('/remove/:channelId')
  @ApiParam({
    name: 'channelId',
    description: 'The channel id',
  })
  @ApiOkResponse({
    description:
      'User deletes a channel. User channel must have the canDelete permission',
    schema: { type: 'string', example: 'OK' },
  })
  @HttpCode(HttpStatus.OK)
  @UserChannelRole(['canDelete'])
  async deleteZone(@CurrentUserChannel() userChannel: UserChannel) {
    await this.channelService.deleteByChannelId(userChannel.channel.id);
    return 'OK';
  }

  @Put('/update/:channelId')
  @ApiCreatedResponse({
    description:
      'User updates a zone. User channel must have the canEdit permission',
    schema: { type: 'string', example: 'OK' },
  })
  @ApiParam({
    name: 'channelId',
    description: 'The channel id',
  })
  @UserChannelRole(['canEdit'])
  async editChannel(
    @CurrentUserChannel() userChannel: UserChannel,
    @Body() editInfo: EditChannelDto,
  ) {
    await this.channelService.editChannelById(userChannel.channel.id, editInfo);
    return 'OK';
  }
}

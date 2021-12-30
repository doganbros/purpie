import { Controller, Delete, Get, Put } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserChannel } from 'entities/UserChannel.entity';
import { UserZone } from 'entities/UserZone.entity';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserPayload } from 'src/auth/interfaces/user.interface';
import { CurrentUserZone } from 'src/zone/decorators/current-user-zone.decorator';
import { UserZoneRole } from 'src/zone/decorators/user-zone-role.decorator';
import { ChannelService } from '../channel.service';
import { CurrentUserChannel } from '../decorators/current-user-channel.decorator';
import { UserChannelRole } from '../decorators/user-channel-role.decorator';
import { UpdateChannelUserRoleDto } from '../dto/update-channel-user-role.dto';
import { UserChannelListResponse } from '../responses/user-channel.response';

@Controller({ path: 'user-channel', version: '1' })
@ApiTags('user-channel')
export class UserChannelController {
  constructor(private channelService: ChannelService) {}

  @Get('list')
  @ApiOkResponse({
    type: UserChannelListResponse,
    isArray: true,
    description: "Get the list of current user's channels",
  })
  @IsAuthenticated()
  async getCurrentUserChannels(@CurrentUser() user: UserPayload) {
    return this.channelService.getCurrentUserChannels(user.id);
  }

  @Get('list/:userZoneId')
  @ApiOkResponse({
    type: UserChannelListResponse,
    description: "Get the list of current user's zone channels",
  })
  @ApiParam({
    name: 'userZoneId',
    description: 'user zone id',
  })
  @UserZoneRole()
  async getCurrentUserZoneChannels(
    @CurrentUser() user: UserPayload,
    @CurrentUserZone() currentUserZone: UserZone,
  ) {
    return this.channelService.getCurrentUserZoneChannels(
      currentUserZone.zone.id,
      user.id,
    );
  }

  @Get('detail/:userChannelId')
  @ApiOkResponse({
    type: UserChannelListResponse,
    description:
      'Get channel details by user channel id. This endpoint include channel meeting config.',
  })
  @ApiParam({
    name: 'userChannelId',
    description: 'User Channel Id',
  })
  @UserChannelRole()
  async getUserChannelById(
    @CurrentUserChannel() currentUserchannel: UserChannel,
  ) {
    return currentUserchannel;
  }

  @Delete('remove/:userChannelId')
  @ApiParam({
    name: 'UserZoneIdParams',
    description: 'User Zone Id',
  })
  @ApiOkResponse({
    schema: { type: 'string', example: 'OK' },
  })
  @UserChannelRole()
  async deleteUserChannelById(
    @CurrentUserZone() currentUserChannel: UserChannel,
  ) {
    await currentUserChannel.remove();
    return 'OK';
  }

  @Put('/role/update')
  @UserChannelRole(['canSetRole'])
  async updateUserChannelRole(info: UpdateChannelUserRoleDto) {
    await this.channelService.updateChannelUserRole(info);
    return 'OK';
  }
}

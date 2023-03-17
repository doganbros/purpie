import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Headers,
} from '@nestjs/common';
import { ApiHeader, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserChannel } from 'entities/UserChannel.entity';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserTokenPayload } from 'src/auth/interfaces/user.interface';
import { CurrentUserChannel } from '../decorators/current-user-channel.decorator';
import { UserChannelRole } from '../decorators/user-channel-role.decorator';
import { UserChannelListResponse } from '../responses/user-channel.response';
import { UserChannelService } from '../services/user-channel.service';
import { ErrorTypes } from '../../../types/ErrorTypes';

@Controller({ path: 'user-channel', version: '1' })
@ApiTags('user-channel')
export class UserChannelController {
  constructor(private userChannelService: UserChannelService) {}

  @Get('list')
  @ApiOkResponse({
    type: UserChannelListResponse,
    isArray: true,
    description:
      "Get the list of current user's channels. public channels of zone not joined yet will be listed when user is authorized in the zone(public, or userzone). But the userChannel id will be null",
  })
  @ApiHeader({
    name: 'app-subdomain',
    required: false,
    description: 'Zone subdomain',
  })
  @IsAuthenticated()
  async getCurrentUserChannels(
    @CurrentUser() user: UserTokenPayload,
    @Headers('app-subdomain') subdomain: string,
  ) {
    return this.userChannelService.getCurrentUserChannels(user.id, subdomain);
  }

  @Get('list/all')
  @ApiOkResponse({
    type: UserChannelListResponse,
    isArray: true,
    description:
      "Get the list of current user's channels. public channels of zone not joined yet will be listed when user is authorized in the zone(public, or userzone). But the userChannel id will be null",
  })
  @IsAuthenticated()
  async getCurrentUserAllChannels(@CurrentUser() user: UserTokenPayload) {
    return this.userChannelService.getUserAllChannels(user.id);
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
    @CurrentUserChannel() currentUserChannel: UserChannel,
  ) {
    if (
      currentUserChannel.channelRole.roleCode === 'SUPER_ADMIN' ||
      currentUserChannel.channelRole.roleCode === 'ADMIN'
    )
      throw new BadRequestException(
        ErrorTypes.ADMIN_CANT_UNFOLLOW_CHANNEL,
        'Channel admin can not unfollow the channel',
      );
    await currentUserChannel.remove();
    return 'OK';
  }
}

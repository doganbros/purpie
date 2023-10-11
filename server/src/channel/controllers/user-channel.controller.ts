import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Headers,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UserChannel } from 'entities/UserChannel.entity';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserTokenPayload } from 'src/auth/interfaces/user.interface';
import { CurrentUserChannel } from '../decorators/current-user-channel.decorator';
import { UserChannelRole } from '../decorators/user-channel-role.decorator';
import { UserChannelListResponse } from '../responses/user-channel.response';
import { UserChannelService } from '../services/user-channel.service';
import { ErrorTypes } from '../../../types/ErrorTypes';
import { ChannelRoleCode } from '../../../types/RoleCodes';
import { errorResponseDoc } from '../../../helpers/error-response-doc';

@Controller({ path: 'user-channel', version: '1' })
@ApiTags('User Channel')
export class UserChannelController {
  constructor(private userChannelService: UserChannelService) {}

  @Get('list')
  @ApiOkResponse({
    type: UserChannelListResponse,
    isArray: true,
    description:
      "Get the list of current user's channels. Public channels of zone not joined yet will be listed when user is authorized in the zone(public, or userzone). But the userChannel id will be null",
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
  @ApiBadRequestResponse({
    description:
      'Error thrown when the owner of the channel want to leave from channel.',
    schema: errorResponseDoc(
      400,
      'Channel owner can not unfollow the channel',
      'OWNER_CANT_UNFOLLOW_CHANNEL',
    ),
  })
  @ApiParam({
    name: 'UserZoneIdParams',
    description: 'User Zone Id',
  })
  @ApiOkResponse({
    description: 'User can leave from channel.',
  })
  @UserChannelRole()
  async deleteUserChannelById(
    @CurrentUserChannel() currentUserChannel: UserChannel,
  ) {
    if (currentUserChannel.channelRole.roleCode === ChannelRoleCode.OWNER)
      throw new BadRequestException(
        ErrorTypes.OWNER_CANT_UNFOLLOW_CHANNEL,
        'Channel owner can not unfollow the channel',
      );
    await currentUserChannel.remove();
  }
}

import { Controller, Headers, Delete, Get, Put } from '@nestjs/common';
import { ApiHeader, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserChannel } from 'entities/UserChannel.entity';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserPayload } from 'src/auth/interfaces/user.interface';
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
    @CurrentUser() user: UserPayload,
    @Headers('app-subdomain') subdomain: string,
  ) {
    return this.channelService.getCurrentUserChannels(user.id, subdomain);
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

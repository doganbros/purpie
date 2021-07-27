import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UserChannel } from 'entities/UserChannel.entity';
import { UserZone } from 'entities/UserZone.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserPayload } from 'src/auth/interfaces/user.interface';
import { PaginationQueryParams } from 'src/utils/decorators/pagination-query-params.decorator';
import { CurrentUserZone } from 'src/zone/decorators/current-user-zone.decorator';
import { UserZoneRole } from 'src/zone/decorators/user-zone-role.decorator';
import { PaginationQuery } from 'types/PaginationQuery';
import { ChannelService } from '../channel.service';
import { CurrentUserChannel } from '../decorators/current-user-channel.decorator';
import { UserChannelRole } from '../decorators/user-channel-role.decorator';
import { CreateChannelDto } from '../dto/create-channel.dto';

@Controller({ path: 'user-channel', version: '1' })
@ApiTags('user-channel')
export class UserChannelController {
  constructor(private channelService: ChannelService) {}

  @Post('/:userZoneId')
  @ApiCreatedResponse({
    description:
      'Current authenticated user adds a new channel belong to the zoneId.',
  })
  @ApiParam({
    name: 'userZoneId',
    type: 'user zone id',
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

  @Get('/list/:userZoneId')
  @ApiOkResponse({
    description: "Get the list of current user's zones",
  })
  @ApiParam({
    name: 'userZoneId',
    description: 'user zone id',
  })
  @PaginationQueryParams()
  @UserZoneRole()
  async getCurrentUserZones(
    @CurrentUser() user: UserPayload,
    @CurrentUserZone() currentUserZone: UserZone,
    @Query() paginatedQuery: PaginationQuery,
  ) {
    const result = await this.channelService.getCurrentUserZoneChannels(
      currentUserZone.zone.id,
      user.id,
      paginatedQuery,
    );
    return result;
  }

  @Get('/get/:userChannelId')
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

  @Delete('/:userChannelId')
  @ApiParam({
    name: 'UserZoneIdParams',
    description: 'User Zone Id',
  })
  @UserChannelRole()
  async deleteUserChannelById(
    @CurrentUserZone() currentUserChannel: UserChannel,
  ) {
    await currentUserChannel.remove();
    return 'OK';
  }
}

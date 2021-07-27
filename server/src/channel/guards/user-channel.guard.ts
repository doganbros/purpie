import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ChannelService } from '../channel.service';

@Injectable()
export class UserChannelGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private channelService: ChannelService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userChannelPermissions = this.reflector.get<string[]>(
      'userChannelPermissions',
      context.getHandler(),
    );

    if (!req.user)
      throw new InternalServerErrorException(
        'User payload must be retrieved before using this guard',
        'USER_PAYLOAD_REQUIRED',
      );

    const { userChannelId, channelId } = req.params;

    if (channelId) {
      req.userChannel = await this.channelService.getUserChannel(req.user.id, {
        channelId: Number.parseInt(channelId, 10),
      });
    } else if (userChannelId) {
      req.userChannel = await this.channelService.getUserChannel(req.user.id, {
        id: Number.parseInt(userChannelId, 10),
      });
    }

    if (!req.userChannel)
      throw new NotFoundException('User Zone not found', 'USER_ZONE_NOT_FOUND');

    for (const permission of userChannelPermissions) {
      if (!req.userChannel.channelRole[permission])
        throw new NotFoundException(
          'User channel not found',
          'USER_CHANNEL_NOT_FOUND',
        );
    }

    return true;
  }
}

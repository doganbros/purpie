import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserChannelService } from '../services/user-channel.service';

@Injectable()
export class UserChannelGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userChannelService: UserChannelService,
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
      req.userChannel = await this.userChannelService.getUserChannel(
        req.user.id,
        {
          channelId: Number.parseInt(channelId, 10),
        },
      );
    } else if (userChannelId) {
      req.userChannel = await this.userChannelService.getUserChannel(
        req.user.id,
        {
          id: Number.parseInt(userChannelId, 10),
        },
      );
    }

    if (!req.userChannel)
      throw new NotFoundException(
        'User Channel not found',
        'USER_CHANNEL_NOT_FOUND',
      );

    for (const permission of userChannelPermissions) {
      if (!req.userChannel.channelRole[permission])
        throw new UnauthorizedException(
          'You are not authorized',
          'NOT_AUTHORIZED',
        );
    }

    return true;
  }
}

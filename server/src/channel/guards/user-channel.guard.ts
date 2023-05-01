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
import { ErrorTypes } from '../../../types/ErrorTypes';

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
        ErrorTypes.USER_PAYLOAD_REQUIRED,
        'User payload must be retrieved before using this guard',
      );

    const { userChannelId, channelId } = req.params;
    console.log(req.params);
    if (channelId) {
      req.userChannel = await this.userChannelService.getUserChannel(
        req.user.id,
        {
          channelId,
        },
      );
    } else if (userChannelId) {
      req.userChannel = await this.userChannelService.getUserChannel(
        req.user.id,
        {
          userChannelId,
        },
      );
    }

    if (!req.userChannel)
      throw new NotFoundException(
        ErrorTypes.CHANNEL_NOT_FOUND,
        'User Channel not found',
      );

    for (const permission of userChannelPermissions) {
      if (!req.userChannel.channelRole[permission])
        throw new UnauthorizedException(
          ErrorTypes.NOT_AUTHORIZED,
          'You are not authorized',
        );
    }

    return true;
  }
}

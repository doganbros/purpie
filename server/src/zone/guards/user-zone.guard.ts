import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserZoneService } from '../services/user-zone.service';
import { ErrorTypes } from '../../../types/ErrorTypes';

@Injectable()
export class UserZoneGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userZoneService: UserZoneService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userZonePermissions = this.reflector.get<string[]>(
      'userZonePermissions',
      context.getHandler(),
    );

    if (!req.user)
      throw new InternalServerErrorException(
        ErrorTypes.USER_PAYLOAD_REQUIRED,
        'User payload must be retrieved before using this guard',
      );

    const { userZoneId, zoneId } = req.params;

    const subdomain = req.headers['app-subdomain'];

    if (zoneId) {
      req.userZone = await this.userZoneService.getUserZone(req.user.id, {
        zoneId: Number.parseInt(zoneId, 10),
      });
    } else if (userZoneId) {
      req.userZone = await this.userZoneService.getUserZone(req.user.id, {
        id: Number.parseInt(userZoneId, 10),
      });
    } else if (subdomain) {
      req.userZone = await this.userZoneService.getUserZone(req.user.id, {
        subdomain,
      });
    }

    if (!req.userZone)
      throw new NotFoundException(
        ErrorTypes.ZONE_NOT_FOUND,
        'User Zone not found',
      );

    for (const permission of userZonePermissions) {
      if (!req.userZone.zoneRole[permission])
        throw new UnauthorizedException(
          ErrorTypes.NOT_AUTHORIZED,
          'You are not authorized',
        );
    }

    return true;
  }
}

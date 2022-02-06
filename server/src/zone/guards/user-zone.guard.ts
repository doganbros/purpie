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
        'User payload must be retrieved before using this guard',
        'USER_PAYLOAD_REQUIRED',
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
      throw new NotFoundException('User Zone not found', 'USER_ZONE_NOT_FOUND');

    for (const permission of userZonePermissions) {
      if (!req.userZone.zoneRole[permission])
        throw new UnauthorizedException(
          'You are not authorized',
          'NOT_AUTHORIZED',
        );
    }

    return true;
  }
}

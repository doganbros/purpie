import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ZoneService } from '../zone.service';

@Injectable()
export class UserZoneGuard implements CanActivate {
  constructor(private reflector: Reflector, private zoneService: ZoneService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userZonePermissions = this.reflector.get<string[] | undefined>(
      'userZonePermissions',
      context.getHandler(),
    );

    if (!req.user) return false;

    const { id, zoneId } = req.params;

    if (zoneId) {
      req.userZone = await this.zoneService.getUserZone(req.user.id, {
        zoneId: Number.parseInt(zoneId, 10),
      });
    } else if (id) {
      req.userZone = await this.zoneService.getUserZone(req.user.id, {
        id: Number.parseInt(id, 10),
      });
    }

    if (!req.userZone)
      throw new NotFoundException('Zone not found', 'USER_ZONE_NOT_FOUND');

    if (
      userZonePermissions?.includes('isAdmin') &&
      req.userZone.adminId !== req.user.id
    )
      throw new NotFoundException('Zone not found', 'USER_ZONE_NOT_FOUND');

    const otherPermissions = userZonePermissions?.filter((p) =>
      ['canCreateChannel', 'canAddUser'].includes(p),
    );

    if (otherPermissions?.length)
      for (const permission of otherPermissions) {
        if (!req.userZone[permission])
          throw new NotFoundException('Zone not found', 'USER_ZONE_NOT_FOUND');
      }

    return true;
  }
}

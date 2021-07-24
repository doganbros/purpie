import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiNotFoundResponse } from '@nestjs/swagger';
import { UserRole } from 'entities/UserRole.entity';
import { ZoneRole } from 'entities/ZoneRole.entity';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { RolePermission } from 'types/RolePermission';
import { UserZoneGuard } from '../guards/user-zone.guard';

export const UserZoneRole = (
  permissions: Array<RolePermission<ZoneRole>> = [],
  userPermissions: Array<RolePermission<UserRole>> = [],
) =>
  applyDecorators(
    IsAuthenticated(userPermissions),
    SetMetadata('userZonePermissions', permissions),
    UseGuards(UserZoneGuard),
    ApiBearerAuth(),
    ApiNotFoundResponse({
      description: 'User Zone not found',
      status: 404,
    }),
  );

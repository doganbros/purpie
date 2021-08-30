import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiNotFoundResponse } from '@nestjs/swagger';
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
    ApiNotFoundResponse({
      description:
        'User Zone not found. Error thrown when user zone is not found.',
      status: 404,
    }),
  );

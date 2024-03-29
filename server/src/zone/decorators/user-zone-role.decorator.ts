import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiNotFoundResponse } from '@nestjs/swagger';
import { UserRole } from 'entities/UserRole.entity';
import { ZoneRole } from 'entities/ZoneRole.entity';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { UserPermissionOptions } from 'src/auth/interfaces/user.interface';
import { RolePermission } from 'types/RolePermission';
import { UserZoneGuard } from '../guards/user-zone.guard';
import { errorResponseDoc } from '../../../helpers/error-response-doc';
import { ErrorTypes } from '../../../types/ErrorTypes';

export const UserZoneRole = (
  permissions: Array<RolePermission<ZoneRole>> = [],
  userPermissions: Array<RolePermission<UserRole>> = [],
  userZonePermissionOptions: Record<string, any> = {},
  userPermissionOptions: UserPermissionOptions = {},
) =>
  applyDecorators(
    IsAuthenticated(userPermissions, userPermissionOptions),
    SetMetadata('userZonePermissionOptions', userZonePermissionOptions),
    SetMetadata('userZonePermissions', permissions),
    UseGuards(UserZoneGuard),
    ApiNotFoundResponse({
      description:
        'User Zone not found. Error thrown when user zone is not found.',
      schema: errorResponseDoc(
        404,
        'User Zone not found',
        ErrorTypes.ZONE_NOT_FOUND,
      ),
    }),
  );

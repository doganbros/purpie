import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserRole } from 'entities/UserRole.entity';
import { RolePermission } from 'types/RolePermission';
import { AuthGuard } from '../guards/auth.guard';

export const IsAuthenticated = (
  permissions: Array<RolePermission<UserRole>> = [],
  options: Record<string, any> = {},
) =>
  applyDecorators(
    SetMetadata('userPermissions', permissions),
    SetMetadata('userPermissionsOptions', options),
    UseGuards(AuthGuard),
    ApiUnauthorizedResponse({
      description:
        "This is the error thrown when the user has not logged in. (Error Code: 'NOT_SIGNED_IN' is returned when jwt is not valid)",
      status: 401,
    }),
  );

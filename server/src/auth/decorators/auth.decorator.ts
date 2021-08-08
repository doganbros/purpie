import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
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
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      status: 401,
    }),
  );

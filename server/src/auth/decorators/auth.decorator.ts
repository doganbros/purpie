import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserRole } from 'entities/UserRole.entity';
import { RolePermission } from 'types/RolePermission';
import { AuthGuard } from '../guards/auth.guard';
import { UserPermissionOptions } from '../interfaces/user.interface';
import { errorResponseDoc } from '../../../helpers/error-response-doc';

export const IsAuthenticated = (
  permissions: Array<RolePermission<UserRole>> = [],
  options: UserPermissionOptions = {},
) =>
  applyDecorators(
    SetMetadata('userPermissions', permissions),
    SetMetadata('userPermissionOptions', options),
    UseGuards(AuthGuard),
    ApiUnauthorizedResponse({
      description:
        'Error thrown when the user has not authorized or JWT is invalid.',
      status: 401,
      schema: errorResponseDoc(
        401,
        'You not authorized to use this route',
        'NOT_SIGNED_IN',
      ),
    }),
  );

import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ClientRole } from 'entities/ClientRole.entity';
import { RolePermission } from 'types/RolePermission';
import { ClientAuthGuard } from '../guards/client-auth.guard';

export const IsClientAuthenticated = (
  permissions: Array<RolePermission<ClientRole>> = [],
) =>
  applyDecorators(
    SetMetadata('clientPermissions', permissions),
    UseGuards(ClientAuthGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      status: 401,
    }),
  );

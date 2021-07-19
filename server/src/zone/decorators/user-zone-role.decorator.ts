import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiNotFoundResponse } from '@nestjs/swagger';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { UserZoneGuard } from '../guards/user-zone.guard';

export const UserZoneRole = (
  permissions: Array<string> = [],
  userPermissions: Array<string> = [],
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

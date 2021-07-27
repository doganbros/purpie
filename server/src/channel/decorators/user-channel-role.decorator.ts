import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiNotFoundResponse } from '@nestjs/swagger';
import { ChannelRole } from 'entities/ChannelRole.entity';
import { UserRole } from 'entities/UserRole.entity';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { RolePermission } from 'types/RolePermission';
import { UserChannelGuard } from '../guards/user-channel.guard';

export const UserChannelRole = (
  permissions: Array<RolePermission<ChannelRole>> = [],
  userPermissions: Array<RolePermission<UserRole>> = [],
) =>
  applyDecorators(
    IsAuthenticated(userPermissions),
    SetMetadata('userChannelPermissions', permissions),
    UseGuards(UserChannelGuard),
    ApiBearerAuth(),
    ApiNotFoundResponse({
      description: 'User Channel not found',
      status: 404,
    }),
  );

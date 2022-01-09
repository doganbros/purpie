import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiNotFoundResponse } from '@nestjs/swagger';
import { ChannelRole } from 'entities/ChannelRole.entity';
import { UserRole } from 'entities/UserRole.entity';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { UserPermissionOptions } from 'src/auth/interfaces/user.interface';
import { RolePermission } from 'types/RolePermission';
import { UserChannelGuard } from '../guards/user-channel.guard';

export const UserChannelRole = (
  permissions: Array<RolePermission<ChannelRole>> = [],
  userPermissions: Array<RolePermission<UserRole>> = [],
  userChannelPermissionOptions: Record<string, any> = {},
  userPermissionOptions: UserPermissionOptions = {},
) =>
  applyDecorators(
    IsAuthenticated(userPermissions, userPermissionOptions),
    SetMetadata('userChannelPermissionOptions', userChannelPermissionOptions),
    SetMetadata('userChannelPermissions', permissions),
    UseGuards(UserChannelGuard),
    ApiNotFoundResponse({
      description: 'User Channel not found',
      status: 404,
    }),
  );

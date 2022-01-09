import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'entities/UserRole.entity';
import { SoftEntity } from 'types/SoftEntity';

export class UserProfile {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  mattermostId: string | null;

  @ApiProperty()
  userName?: string | null;

  @ApiProperty()
  displayPhoto?: string | null;

  refreshTokenId?: string;

  @ApiProperty({
    type: 'object',
    properties: {
      roleCode: {
        type: 'string',
        example: 'SUPER_ADMIN',
        enum: ['SUPER_ADMIN', 'ADMIN', 'NORMAL'],
      },
      roleName: { type: 'string', example: 'Super Admin' },
      canCreateZone: { type: 'boolean' },
      canCreateClient: { type: 'boolean' },
      canManageRole: { type: 'boolean' },
    },
  })
  userRole: SoftEntity<UserRole>;
}

export interface UserTokenPayload {
  id: number;
  mattermostId: string;
  mattermostTokenId: string;
  refreshTokenId?: string;
}

export interface UserPermissionOptions {
  removeAccessTokens?: boolean;
  injectUserProfile?: boolean;
}

export class UserBasic {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  googleId?: string;

  facebookId?: string;
}

export class UserBasicWithToken {
  @ApiProperty()
  user: UserBasic;

  @ApiProperty()
  token: string;
}

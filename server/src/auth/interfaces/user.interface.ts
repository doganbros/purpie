import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'entities/UserRole.entity';
import { SoftEntity } from 'types/SoftEntity';

export class UserProfile {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  email: string;

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

  @ApiProperty()
  membership?: string;
}

export interface UserTokenPayload {
  id: string;
  refreshTokenId?: string;
}

export interface ConferenceUser {
  id: number;
  name: string;
  email: string;
}

export interface UserPermissionOptions {
  removeAccessTokens?: boolean;
  injectUserProfile?: boolean;
}

export class UserBasic {
  @ApiProperty()
  fullName: string;

  @ApiProperty()
  email: string;

  googleId?: string;
}

export class UserBasicWithToken {
  @ApiProperty()
  user: UserBasic;

  @ApiProperty()
  token: string;
}

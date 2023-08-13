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
}

export interface UserTokenPayload {
  id: string;
  refreshTokenId?: string;
}

export interface ConferenceUser {
  id: string;
  name: string;
  email: string;
}

export interface UserPermissionOptions {
  removeAccessTokens?: boolean;
  injectUserProfile?: boolean;
  injectUserMembership?: boolean;
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

export enum MembershipType {
  FREE = 'FREE',
  ESSENTIAL = 'ESSENTIAL',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

export class UserMembership {
  @ApiProperty()
  id: string;

  @ApiProperty()
  type: MembershipType;

  @ApiProperty()
  price: number;

  @ApiProperty()
  channelCount: number;

  @ApiProperty()
  zoneCount: number;

  @ApiProperty()
  meetingCount: number;

  @ApiProperty()
  streamCount: number;

  @ApiProperty()
  webinarCount: number;

  @ApiProperty()
  streamingStudioCount: number;

  @ApiProperty()
  meetingDuration: number;

  @ApiProperty()
  meetingMaxParticipantCount: number;

  @ApiProperty()
  streamMeeting: boolean;

  @ApiProperty()
  videoSize: number;
}

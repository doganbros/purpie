import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'entities/UserRole.entity';
import { SoftEntity } from 'types/SoftEntity';

export class UserPayload {
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
  mattermostTokenId?: string | null;

  @ApiProperty()
  userName?: string | null;

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
      canSetRole: { type: 'boolean' },
    },
  })
  userRole: SoftEntity<UserRole>;
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

export class UserPayloadWithToken {
  @ApiProperty()
  user: UserPayload;

  @ApiProperty()
  token: string;
}

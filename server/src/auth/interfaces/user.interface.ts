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

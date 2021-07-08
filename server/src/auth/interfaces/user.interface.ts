import { ApiProperty } from '@nestjs/swagger';

export class UserPayload {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;
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

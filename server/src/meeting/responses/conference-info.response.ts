import { ApiProperty } from '@nestjs/swagger';

class ConferenceInfoUser {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  userName: string;

  @ApiProperty({ nullable: true })
  photoURL: string | null;
}
class ConferenceInfoZone {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  subdomain: string;

  @ApiProperty()
  public: boolean;

  @ApiProperty({ nullable: true, type: 'string' })
  photoURL: string | null;
}

class ConferenceInfoChannel {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  topic: string;

  @ApiProperty()
  public: boolean;

  @ApiProperty({ nullable: true, type: 'string' })
  photoURL: string | null;

  @ApiProperty()
  zone: ConferenceInfoZone;
}

export class ConferenceInfoResponse {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: ['channel', 'user'] })
  type: 'channel' | 'user';

  @ApiProperty({
    nullable: true,
    description:
      'This is null when type is user. That is a meeting created in a user profile',
  })
  channel?: ConferenceInfoChannel;

  @ApiProperty({ nullable: true })
  user?: ConferenceInfoUser;
}

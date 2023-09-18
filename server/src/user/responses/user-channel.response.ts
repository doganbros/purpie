import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class Channel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdOn: Date;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description: string;

  @ApiProperty()
  public: boolean;

  @ApiPropertyOptional()
  displayPhoto: string;

  @ApiProperty()
  zoneId: string;
}

class UserChannel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  zone: Channel;
}

export class UserChannelResponse {
  @ApiProperty({ isArray: true })
  data: UserChannel;

  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  skip: number;
}

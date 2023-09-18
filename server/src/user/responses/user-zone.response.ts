import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class Zone {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdOn: Date;

  @ApiProperty()
  name: string;

  @ApiProperty()
  subdomain: string;

  @ApiPropertyOptional()
  description: string;

  @ApiProperty()
  public: boolean;

  @ApiPropertyOptional()
  displayPhoto: string;
}

class UserZone {
  @ApiProperty()
  id: string;

  @ApiProperty()
  zone: Zone;
}

export class UserZoneResponse {
  @ApiProperty({ isArray: true })
  data: UserZone;

  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  skip: number;
}

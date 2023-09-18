import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class SearchZone {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdOn: string;

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

export class SearchZoneResponse {
  @ApiProperty({ isArray: true })
  data: SearchZone;

  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  skip: number;
}

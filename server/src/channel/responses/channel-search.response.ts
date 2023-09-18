import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ChannelZone {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  subdomain: string;

  @ApiPropertyOptional()
  description: string;
}

class SearchChannel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdOn: Date;

  @ApiProperty()
  name: string;

  @ApiProperty()
  public: boolean;

  @ApiPropertyOptional()
  displayPhoto: string;

  @ApiProperty()
  zone: ChannelZone;
}

export class ChannelSearchResponse {
  @ApiProperty({ isArray: true })
  data: SearchChannel;

  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  skip: number;
}

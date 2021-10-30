import { ApiProperty } from '@nestjs/swagger';

class PublicChannelSuggestionList {
  @ApiProperty()
  channel_id: number;

  @ApiProperty()
  channel_createdOn: Date;

  @ApiProperty()
  channel_name: string;

  @ApiProperty()
  channel_topic: string;

  @ApiProperty()
  channel_description: string;

  @ApiProperty()
  channel_public: boolean;

  @ApiProperty()
  zone_id: number;

  @ApiProperty()
  zone_name: string;

  @ApiProperty()
  zone_subdomain: string;

  @ApiProperty()
  category_id: number;

  @ApiProperty()
  category_name: string;

  @ApiProperty()
  channel_membersCount: string;
}

class PublicZoneSuggestionList {
  @ApiProperty()
  zone_id: number;

  @ApiProperty()
  zone_createdOn: Date;

  @ApiProperty()
  zone_name: string;

  @ApiProperty()
  zone_subdomain: string;

  @ApiProperty()
  zone_description: string;

  @ApiProperty()
  channel_public: boolean;

  @ApiProperty()
  category_id: number;

  @ApiProperty()
  category_name: string;

  @ApiProperty()
  zone_channelCount: string;

  @ApiProperty()
  zone_membersCount: string;
}

export class PublicChannelSuggestionListResponse {
  @ApiProperty({ isArray: true })
  data: PublicChannelSuggestionList;

  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  skip: number;
}

export class PublicZoneSuggestionListResponse {
  @ApiProperty({ isArray: true })
  data: PublicZoneSuggestionList;

  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  skip: number;
}

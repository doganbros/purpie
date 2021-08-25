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

class BaseActivityFeedList {
  @ApiProperty()
  meeting_id: number;

  @ApiProperty()
  meeting_title: string;

  @ApiProperty()
  meeting_description: string;

  @ApiProperty()
  meeting_slug: string;

  @ApiProperty()
  meeting_startDate: Date;

  @ApiProperty({ nullable: true })
  meeting_channelId: number;

  @ApiProperty()
  meeting_public: boolean;

  @ApiProperty()
  meeting_liveStream: boolean;

  @ApiProperty()
  meeting_record: boolean;

  @ApiProperty()
  meetingCreatedBy_id: number;

  @ApiProperty()
  meetingCreatedBy_firstName: string;

  @ApiProperty()
  meetingCreatedBy_lastName: string;

  @ApiProperty()
  meetingCreatedBy_email: string;
}

class MixedActivityFeedList extends BaseActivityFeedList {
  @ApiProperty()
  channel_meeting_id: number;

  @ApiProperty()
  channel_meeting_name: string;

  @ApiProperty()
  channel_meeting_topic: string;

  @ApiProperty()
  channel_meeting_description: string;

  @ApiProperty()
  channel_meeting_public: boolean;

  @ApiProperty()
  zone_meeting_id: boolean;

  @ApiProperty()
  zone_meeting_name: string;

  @ApiProperty()
  zone_meeting_subdomain: string;

  @ApiProperty()
  zone_meeting_public: boolean;
}

export class MixedActivityFeedListResponse {
  @ApiProperty({ isArray: true })
  data: MixedActivityFeedList;

  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  skip: number;
}

export class PublicActivityFeedListResponse {
  @ApiProperty({ isArray: true })
  data: BaseActivityFeedList;

  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  skip: number;
}

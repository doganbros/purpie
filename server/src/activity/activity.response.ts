import { ApiProperty } from '@nestjs/swagger';
import { User } from 'entities/User.entity';
import { PostType } from 'types/Post';

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
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty({ enum: ['meeting', 'static-video'], example: 'meeting' })
  type: PostType;

  @ApiProperty({ nullable: true })
  channelId: number;

  @ApiProperty()
  public: boolean;

  @ApiProperty()
  liveStream: boolean;

  @ApiProperty()
  record: boolean;

  @ApiProperty()
  userContactExclusive: boolean;

  @ApiProperty({ type: User })
  createdBy: User;

  @ApiProperty({ isArray: true, type: String })
  tags: Array<string>;
}

class ActivityFeedChannel {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  topic: string;

  @ApiProperty()
  description: string;
}

class MixedActivityFeedList extends BaseActivityFeedList {
  channel: ActivityFeedChannel;
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

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostType } from 'types/Post';

class PostFeedUser {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  displayPhoto: string;
}

class PostFeedReaction {
  @ApiProperty({ default: 0 })
  likesCount: number;

  @ApiProperty({ default: 0 })
  dislikesCount: number;

  @ApiProperty({ default: 0 })
  commentsCount: number;

  @ApiProperty({ default: 0 })
  viewsCount: number;

  @ApiProperty({ default: 0 })
  liveStreamViewersCount: number;
}

class PostFeedZone {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  subdomain: string;

  @ApiProperty()
  public: boolean;
}

class PostFeedChannel {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  public: boolean;

  @ApiProperty({ type: PostFeedZone })
  zone: PostFeedZone;
}

export class BasePostFeedList {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdOn: Date;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description: string;

  @ApiProperty()
  slug: string;

  @ApiPropertyOptional()
  startDate: Date;

  @ApiPropertyOptional()
  endDate: Date;

  @ApiPropertyOptional()
  conferenceStartDate: Date;

  @ApiPropertyOptional()
  conferenceEndDate: Date;

  @ApiPropertyOptional()
  timeZone: string;

  @ApiProperty({ enum: ['meeting', 'video', 'livestream'], default: 'meeting' })
  type: PostType;

  @ApiPropertyOptional()
  createdById: string;

  @ApiProperty({ nullable: true })
  channelId: number;

  @ApiProperty({ default: false })
  streaming: boolean;

  @ApiProperty({ default: false })
  public: boolean;

  @ApiProperty({ default: false })
  liveStream: boolean;

  @ApiProperty({ default: false })
  record: boolean;

  @ApiPropertyOptional()
  videoName: string;

  @ApiPropertyOptional()
  postReactionId: string;

  @ApiProperty({ default: true })
  allowDislike: boolean;

  @ApiProperty({ default: true })
  allowReaction: boolean;

  @ApiProperty({ default: true })
  allowComment: boolean;

  @ApiPropertyOptional()
  liked: boolean;

  @ApiPropertyOptional()
  saved: boolean;

  @ApiPropertyOptional()
  viewed: boolean;

  @ApiPropertyOptional()
  disliked: boolean;

  @ApiProperty({ type: PostFeedUser })
  createdBy: PostFeedUser;

  @ApiProperty({ type: PostFeedReaction })
  postReaction: PostFeedReaction;

  @ApiPropertyOptional({ type: PostFeedChannel })
  channel: PostFeedChannel;
}

class MixedPostFeedList extends BasePostFeedList {
  channel: PostFeedChannel;
}

export const MixedPostFeedDetail = MixedPostFeedList;

export class MixedPostFeedListResponse {
  @ApiProperty({ isArray: true })
  data: MixedPostFeedList;

  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  skip: number;
}

export class PublicPostFeedListResponse {
  @ApiProperty({ isArray: true })
  data: BasePostFeedList;

  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  skip: number;
}

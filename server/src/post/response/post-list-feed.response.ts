import { ApiProperty } from '@nestjs/swagger';
import { User } from 'entities/User.entity';
import { PostType } from 'types/Post';

class BasePostFeedList {
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

  @ApiProperty({ enum: ['meeting', 'video'], example: 'meeting' })
  type: PostType;

  @ApiProperty({ nullable: true })
  channelId: number;

  @ApiProperty()
  public: boolean;

  @ApiProperty()
  private: boolean;

  @ApiProperty()
  liveStream: boolean;

  @ApiProperty()
  streaming: boolean;

  @ApiProperty()
  allowReaction: boolean;

  @ApiProperty()
  allowComment: boolean;

  @ApiProperty()
  record: boolean;

  @ApiProperty()
  userContactExclusive: boolean;

  @ApiProperty({ type: User })
  createdBy: User;
}

class PostFeedChannel {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
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

import { ApiProperty } from '@nestjs/swagger';
import { User } from 'entities/User.entity';

class BaseMeetingList {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  public: boolean;

  @ApiProperty()
  videoName: string;

  @ApiProperty()
  record: boolean;

  @ApiProperty()
  liveStream: boolean;

  @ApiProperty()
  channelId: number;

  @ApiProperty()
  createdBy: User;
}

export class PublicMeetingListResponse {
  @ApiProperty({ isArray: true })
  data: BaseMeetingList;

  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  skip: number;
}

class MeetingChannelInfo {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}

class MixedMeetingList extends BaseMeetingList {
  @ApiProperty({ nullable: true })
  channel?: MeetingChannelInfo;
}

export class MixedMeetingListResponse {
  @ApiProperty({ isArray: true })
  data: MixedMeetingList;

  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  skip: number;
}

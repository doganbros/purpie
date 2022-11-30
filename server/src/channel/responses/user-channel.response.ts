import { ApiProperty } from '@nestjs/swagger';
import { ChannelRole } from 'entities/ChannelRole.entity';
import { User } from 'entities/User.entity';

class ChannelForUserChannelList {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  public: boolean;

  @ApiProperty()
  zoneId: number;

  @ApiProperty()
  createdBy: User;
}

export class UserChannelListResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdOn: Date;

  @ApiProperty()
  channel: ChannelForUserChannelList;

  @ApiProperty()
  channelRole: ChannelRole;
}

export type UserChannelDetailResponse = UserChannelListResponse;

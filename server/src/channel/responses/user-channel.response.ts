import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'entities/Category.entity';
import { ChannelRole } from 'entities/ChannelRole.entity';
import { User } from 'entities/User.entity';

class ChannelForUserChannelList {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  topic: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  public: boolean;

  @ApiProperty()
  category: Category;

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

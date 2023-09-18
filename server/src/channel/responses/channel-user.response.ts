import { ApiProperty } from '@nestjs/swagger';
import { User } from 'entities/User.entity';
import { ChannelRole } from '../../../entities/ChannelRole.entity';

class ChannelUser {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdOn: Date;

  @ApiProperty()
  user: User;

  @ApiProperty()
  channelRole: ChannelRole;
}
export class ChannelUserResponse {
  @ApiProperty({ isArray: true })
  data: ChannelUser;

  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  skip: number;
}

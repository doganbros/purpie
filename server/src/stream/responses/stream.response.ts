import { ApiProperty } from '@nestjs/swagger';
import { User } from 'entities/User.entity';

const events = ['play_started', 'play_done', 'publish_started', 'publish_done'];

const mediaTypes = ['video', 'audio'];

class StreamLogList {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdOn: Date;

  @ApiProperty()
  slug: string;

  @ApiProperty({ enum: mediaTypes })
  mediaType: string;

  @ApiProperty({ enum: events })
  event: string;

  @ApiProperty({ nullable: true })
  extraInfo: string;

  @ApiProperty({ nullable: true })
  user: User;
}

export class StreamLogResponse {
  @ApiProperty({ isArray: true })
  data: StreamLogList;

  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  skip: number;
}

import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StreamEvent } from 'types/StreamEvent';

const events = [
  'play_started',
  'play_done',
  'publish_started',
  'publish_done',
];

const mediaTypes = ['video', 'audio'];

export class ClientStreamEventDto {
  @ApiProperty({ enum: events })
  @IsIn(events)
  @IsNotEmpty()
  event: StreamEvent;

  @ApiProperty({ enum: mediaTypes })
  @IsOptional()
  @IsIn(mediaTypes)
  mediaType?: 'video' | 'audio';

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ required: false })
  @IsInt()
  @ValidateIf((o) => ['play_started', 'play_done'].includes(o.event))
  userId?: number;
}

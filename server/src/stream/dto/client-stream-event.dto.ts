import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const events = ['publish_started', 'publish_done'] as const;

const mediaTypes = ['video', 'audio'] as const;

const postTypes = ['meeting'] as const;

export class ClientStreamEventDto {
  @ApiProperty({ enum: events })
  @IsIn(events)
  @IsNotEmpty()
  event: typeof events[number];

  @ApiProperty({ enum: mediaTypes, required: false })
  @IsOptional()
  @IsIn(mediaTypes)
  mediaType?: typeof mediaTypes[number];

  @ApiProperty({ enum: postTypes, required: false })
  @IsOptional()
  @IsIn(postTypes)
  postType?: typeof postTypes[number];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ required: false })
  @IsInt()
  @ValidateIf((o) => ['play_started', 'play_done'].includes(o.event))
  userId?: number;
}

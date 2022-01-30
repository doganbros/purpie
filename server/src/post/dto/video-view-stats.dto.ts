import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class VideoViewStats {
  @ApiProperty()
  @IsInt()
  startedFrom: number;

  @ApiProperty()
  @IsInt()
  endedAt: number;

  @ApiProperty()
  @IsInt()
  postId: number;
}

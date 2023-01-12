import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID } from 'class-validator';

export class VideoViewStats {
  @ApiProperty()
  @IsInt()
  startedFrom: number;

  @ApiProperty()
  @IsInt()
  endedAt: number;

  @ApiProperty()
  @IsUUID()
  postId: string;
}

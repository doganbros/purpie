import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VideoIdParams {
  @ApiProperty()
  @IsInt()
  videoId: number;
}

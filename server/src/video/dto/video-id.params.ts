import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class VideoIdParams {
  @ApiProperty()
  @IsInt()
  videoId: number;
}

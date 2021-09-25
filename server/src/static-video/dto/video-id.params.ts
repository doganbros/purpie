import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class VideoIdParams {
  @ApiProperty()
  @IsInt()
  @Transform(({ value }) => Number.parseInt(value, 10))
  videoId: number;
}

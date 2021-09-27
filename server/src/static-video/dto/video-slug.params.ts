import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VideoSlugParams {
  @ApiProperty()
  @IsString()
  slug: string;
}

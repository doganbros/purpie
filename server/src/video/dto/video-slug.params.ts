import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VideoNameParams {
  @ApiProperty()
  @IsString()
  videoName: string;
}

import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostLikeDto {
  @ApiProperty()
  @IsInt()
  postId: number;
}

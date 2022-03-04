import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostCommentLikeDto {
  @ApiProperty()
  @IsInt()
  postId: number;

  @ApiProperty()
  @IsInt()
  postCommentId: number;
}

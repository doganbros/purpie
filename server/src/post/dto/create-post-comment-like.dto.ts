import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostCommentLikeDto {
  @ApiProperty()
  @IsUUID()
  postId: string;

  @ApiProperty()
  @IsUUID()
  postCommentId: string;
}

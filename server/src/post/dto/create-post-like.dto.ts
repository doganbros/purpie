import { IsInt, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostLikeDto {
  @ApiProperty()
  @IsInt()
  postId: number;

  @ApiProperty({
    required: false,
    enum: ['like', 'dislike'],
  })
  @IsOptional()
  @IsIn(['like', 'dislike'])
  type: 'like' | 'dislike';
}

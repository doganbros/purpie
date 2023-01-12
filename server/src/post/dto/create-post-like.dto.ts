import { IsIn, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostLikeDto {
  @ApiProperty()
  @IsUUID()
  postId: string;

  @ApiProperty({
    required: false,
    enum: ['like', 'dislike'],
  })
  @IsOptional()
  @IsIn(['like', 'dislike'])
  type: 'like' | 'dislike';
}

import { IsIn, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostLikeDto {
  @ApiProperty()
  @IsUUID()
  postId: string;

  @ApiPropertyOptional({
    enum: ['like', 'dislike'],
  })
  @IsOptional()
  @IsIn(['like', 'dislike'])
  type: 'like' | 'dislike';
}

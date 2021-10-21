import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostCommentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiProperty()
  @IsInt()
  postId: number;

  @ApiProperty({ description: 'If reply specify the parent post.' })
  @IsInt()
  @IsOptional()
  parentId?: number;
}

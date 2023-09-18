import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostCommentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiProperty()
  @IsUUID()
  postId: string;

  @ApiPropertyOptional({ description: 'If reply specify the parent post.' })
  @IsUUID()
  @IsOptional()
  parentId?: string;
}

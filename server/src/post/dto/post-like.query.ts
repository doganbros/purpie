import { IsIn, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationQuery } from 'types/PaginationQuery';

export class PostLikeQuery extends PaginationQuery {
  @ApiProperty({
    required: false,
    enum: ['likes', 'dislikes'],
    description: "Get either post's likes or dislikes, default is likes",
  })
  @IsOptional()
  @IsIn(['likes', 'dislikes'])
  type: 'likes' | 'dislikes';
}

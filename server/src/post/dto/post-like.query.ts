import { IsIn, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQuery } from 'types/PaginationQuery';

export class PostLikeQuery extends PaginationQuery {
  @ApiPropertyOptional({
    enum: ['likes', 'dislikes'],
    description: "Get either post's likes or dislikes, default is likes",
  })
  @IsOptional()
  @IsIn(['likes', 'dislikes'])
  type: 'likes' | 'dislikes';
}

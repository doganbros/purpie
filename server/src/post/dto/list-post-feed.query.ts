import { IsIn, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQuery } from 'types/PaginationQuery';
import { Type } from 'class-transformer';

export class ListPostFeedQuery extends PaginationQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  @Type(() => String)
  userId: string;

  @ApiPropertyOptional({
    description: 'Get post created by a particular user',
  })
  @IsOptional()
  userName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  @Type(() => String)
  zoneId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  @Type(() => String)
  channelId: string;

  @ApiPropertyOptional({
    enum: ['meeting', 'video'],
    description: 'The post type to return. By default it returns all posts.',
  })
  @IsOptional()
  postType: 'meeting' | 'video';

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Filter by posts that are public.',
  })
  @IsOptional()
  @IsIn(['false', 'true'])
  public: string;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Filter by posts that are currently streaming.',
  })
  @IsOptional()
  @IsIn(['false', 'true'])
  streaming: string;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Get only following posts',
  })
  @IsOptional()
  @IsIn(['false', 'true'])
  following: string;

  @ApiPropertyOptional({
    example: 'education, programming, music',
    description: 'Search post by tag. Use comma separated for multiple values',
  })
  @IsString()
  @IsOptional()
  tags: string;

  @ApiPropertyOptional({ description: 'Search posts with given search text' })
  @IsOptional()
  @IsString()
  searchTerm: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  folderId: number;

  @ApiPropertyOptional({
    enum: ['time', 'popularity'],
    default: 'popularity',
    description: 'Sort post by time or popularity.',
  })
  @IsOptional()
  sortBy: 'time' | 'popularity';

  @ApiPropertyOptional({
    default: 'DESC',
    enum: ['ASC', 'DESC'],
    description: 'Sort direction of post.',
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortDirection: 'ASC' | 'DESC';
}

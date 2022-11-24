import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationQuery } from 'types/PaginationQuery';
import { Type } from 'class-transformer';

export class ListPostFeedQuery extends PaginationQuery {
  @ApiProperty({
    required: false,
    type: Boolean,
    description: 'Filter by posts that are public.',
  })
  @IsOptional()
  @IsIn(['false', 'true'])
  public: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  userId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  zoneId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  channelId: number;

  @ApiProperty({
    required: false,
    enum: ['meeting', 'video'],
    description: 'The post type to return. By default it returns all posts. ',
  })
  @IsOptional()
  postType: 'meeting' | 'video';

  @ApiProperty({
    required: false,
    type: Boolean,
    description: 'Filter by posts that are currently streaming.',
  })
  @IsOptional()
  @IsIn(['false', 'true'])
  streaming: string;

  @ApiProperty({
    required: false,
    type: Boolean,
    description: 'Get only following post',
  })
  @IsOptional()
  @IsIn(['false', 'true'])
  following: string;

  @ApiProperty({
    required: false,
    description: 'Get post created by a particular user',
  })
  @IsOptional()
  userName: string;

  @ApiProperty({
    required: false,
    enum: ['time', 'popularity'],
    description:
      'Sort post by time or popularity. If not specified, defaults to time',
  })
  @IsOptional()
  sortBy: 'time' | 'popularity';

  @ApiProperty({
    required: false,
    enum: ['ASC', 'DESC'],
    description: 'Sort direction of post. If not specified, defaults to DESC',
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortDirection: 'ASC' | 'DESC';

  @ApiProperty({
    required: false,
    description: 'search post by tag. Use comma separated for multiple values',
  })
  @IsString()
  @IsOptional()
  tags: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  searchTerm: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  folderId: number;
}

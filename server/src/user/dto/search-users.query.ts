import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaginationQuery } from 'types/PaginationQuery';

export class SearchUsersQuery extends PaginationQuery {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    type: String,
    description:
      'User ids to exclude while searching. Should be a comma separated ids',
  })
  @IsOptional()
  excludeIds?: Array<string>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => String)
  channelId?: string;

  @ApiPropertyOptional({
    description: "specify true to search in current user's contacts",
  })
  @IsOptional()
  userContacts?: string;
}

import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CommaSeparatedIds } from 'src/utils/decorators/comma-separated-ids.decorator';
import { Type } from 'class-transformer';
import { PaginationQuery } from 'types/PaginationQuery';

export class SearchUsersQuery implements PaginationQuery {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({
    required: false,
    type: String,
    description:
      'User ids to exclude while searching. Should be a comma separated ids',
  })
  @IsOptional()
  @CommaSeparatedIds({ message: 'Please Enter a valid comma separated ids' })
  excludeIds?: Array<number>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  channelId?: number;

  @ApiProperty({
    required: false,
    description: "specify true to search in current user's contacts",
  })
  @IsOptional()
  userContacts?: string;

  limit: number;

  skip: number;
}

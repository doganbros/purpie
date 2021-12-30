import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationQuery } from 'types/PaginationQuery';

export class SearchQuery extends PaginationQuery {
  @ApiProperty()
  @IsString()
  searchTerm: string;
}

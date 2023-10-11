import { IsInt, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SearchQuery } from 'types/SearchQuery';
import { Type } from 'class-transformer';

export class SearchChannelQuery extends SearchQuery {
  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  zoneId: number;
}

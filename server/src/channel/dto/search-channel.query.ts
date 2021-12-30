import { IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SearchQuery } from 'types/SearchQuery';
import { Type } from 'class-transformer';

export class SearchChannelQuery extends SearchQuery {
  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  zoneId: number;
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { Request } from 'express';

export interface Pagination {
  limit: number;
  skip: number;
}

export class PaginationQuery implements Pagination {
  @ApiPropertyOptional({
    default: 30,
    description: 'The number of records to get.',
  })
  @IsOptional()
  @IsInt()
  limit: number;

  @ApiPropertyOptional({
    default: 0,
    description: 'The number of records to skip. Defaults to 0',
  })
  @IsOptional()
  @IsInt()
  skip: number;
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  limit: number | undefined;
  skip: number | undefined;
}

export type PaginatedRequestQuery<
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = PaginationQuery,
  Locals extends Record<string, any> = Record<string, any>
> = Request<P, ResBody, ReqBody, ReqQuery, Locals>;

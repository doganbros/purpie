import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt } from 'class-validator';
import { Request } from 'express';

export interface Pagination {
  limit: number;
  skip: number;
}

export class PaginationQuery implements Pagination {
  @ApiProperty({
    required: false,
    description: 'The number of zones to get. Defaults to 30',
  })
  @IsOptional()
  @IsInt()
  limit: number;

  @ApiProperty({
    required: false,
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

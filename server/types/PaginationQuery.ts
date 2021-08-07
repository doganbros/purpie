import { Request } from 'express';

export interface Pagination {
  limit: number;
  skip: number;
}

export interface PaginationQuery extends Pagination {
  [key: string]: any;
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

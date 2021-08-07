import dotEnv from 'dotenv';
import path from 'path';
import { PaginationQuery } from 'types/PaginationQuery';

export const loadEnv = (defaultPath?: string) => {
  const envPath =
    defaultPath ?? path.resolve(__dirname, '..', '..', '..', '.env');
  dotEnv.config({ path: envPath });
  return envPath;
};

export const paginate = <T>(
  [data, total]: [data: Array<T>, total: number],
  query: PaginationQuery,
) => {
  return {
    data,
    total,
    limit: query.limit,
    skip: query.skip,
  };
};

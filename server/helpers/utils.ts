import dotEnv from 'dotenv';
import path from 'path';
import { PaginationQuery } from 'types/PaginationQuery';

export const loadEnv = (defaultPath?: string) => {
  const envPath =
    defaultPath ?? path.resolve(__dirname, '..', '..', '..', '.env');
  dotEnv.config({ path: envPath });
  return envPath;
};

export const paginate = (
  [data, total]: [data: Array<Record<string, any>>, total: number],
  query: PaginationQuery,
) => {
  return {
    data,
    total,
    limit: query.limit,
    skip: query.skip,
  };
};

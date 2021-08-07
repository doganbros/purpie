import dotEnv from 'dotenv';
import { stringify } from 'querystring';
import path from 'path';
import { MeetingConfig, MeetingKey } from 'types/Meeting';
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

const setConfigProperty = (value: unknown) => {
  if (typeof value === 'boolean') return value;
  return JSON.stringify(value);
};

export const meetingConfigStringify = (meetingConfig: MeetingConfig) =>
  stringify(
    (Object.keys(meetingConfig) as Array<MeetingKey>).reduce(
      (acc, v) => ({
        ...acc,
        [`config.${v}`]: setConfigProperty(meetingConfig[v]),
      }),
      {},
    ) as any,
  );

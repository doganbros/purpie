import dotEnv from 'dotenv';
import { stringify } from 'querystring';
import path from 'path';
import { MeetingConfig, MeetingKey } from 'types/Meeting';
import { PaginationQuery } from 'types/PaginationQuery';
import { customAlphabet } from 'nanoid';

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

export const lowerAlphaNum = Array(10)
  .fill(null)
  .map((_, i) => i.toString())
  .concat(
    Array(26)
      .fill(null)
      .map((_, i) => String.fromCharCode(97 + i)),
  )
  .join('');

export const alphaNum = Array(10)
  .fill(null)
  .map((_, i) => i.toString())
  .concat(
    Array(26 * 2)
      .fill(null)
      .map((_, i) => String.fromCharCode(65 + (i > 25 ? i + 6 : i))),
  )
  .join('');

export const generateLowerAlphaNumId = (size = 6) => {
  return customAlphabet(lowerAlphaNum, size)();
};

export const separateString = (
  str: string,
  times: number,
  separator = '-',
): string => str.match(new RegExp(`.{${times}}`, 'g'))?.join(separator) || '';

export const emptyPaginatedResponse = (limit: number, skip: number) => ({
  data: [],
  total: 0,
  limit,
  skip,
});

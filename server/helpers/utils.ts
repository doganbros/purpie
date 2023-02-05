import dotEnv from 'dotenv';
import dotEnvExpand from 'dotenv-expand';
import { stringify } from 'querystring';
import crypto from 'crypto';
import path from 'path';
import { JitsiConfig, JitsiConfigKey } from 'types/Meeting';
import { PaginationQuery } from 'types/PaginationQuery';
import { customAlphabet } from 'nanoid';
import { BrowserType } from '../types/BrowserType';

export const loadEnv = (defaultPath?: string) => {
  const envPath =
    defaultPath ?? path.resolve(__dirname, '..', '..', '..', '.env');
  const myEnv = dotEnv.config({ path: envPath });
  dotEnvExpand.expand(myEnv);
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

export const meetingConfigStringify = (
  meetingConfig: JitsiConfig,
  additionalParams: Record<string, any> = {},
) =>
  stringify(
    (Object.keys(meetingConfig) as Array<JitsiConfigKey>).reduce(
      (acc, v) => ({
        ...acc,
        [`config.${v}`]: setConfigProperty(meetingConfig[v]),
      }),
      additionalParams,
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

export async function hash(value: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(8).toString('hex');

    crypto.scrypt(value, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

export async function compareHash(
  value: string,
  hashValue: string,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, key] = hashValue.split(':');
    crypto.scrypt(value, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(key === derivedKey.toString('hex'));
    });
  });
}

export const fetchOrProduceNull = async <T>(
  request: () => Promise<T>,
): Promise<T | null> => {
  try {
    const result = await request();
    return result;
  } catch (err: any) {
    return null;
  }
};
export const booleanValue = (value?: string | boolean | number) =>
  [true, 'true', 1, '1'].includes(value || 0);

export const parsePostTags = (description?: string) => {
  if (!description?.trim()) return null;

  return description.match(/#\w+/gmu)?.map((v) => v.slice(1));
};

export const tsqueryParam = (value: string): string => {
  if (!value?.trim().length) return '';

  return `${value.trim().replace(/[&|]/g, '').replace(/\s/g, ' & ')}:*`;
};

export const detectBrowser = (userAgent: string): BrowserType => {
  let browser = BrowserType.UNKNOWN;

  if (/firefox/i.test(userAgent!)) browser = BrowserType.FIREFOX;
  else if (/chrome/i.test(userAgent!)) browser = BrowserType.CHROME;
  else if (/safari/i.test(userAgent!)) browser = BrowserType.SAFARI;
  else if (/msie/i.test(userAgent!)) browser = BrowserType.MSIE;

  return browser;
};

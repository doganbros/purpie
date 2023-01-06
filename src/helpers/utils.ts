import { nanoid } from 'nanoid';
import i18n from 'i18next';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import colorPair from '../styles/color-pairs.json';
import { ResponseError } from '../models/response-error';

export const errorResponseMessage = (error?: ResponseError): string => {
  if (!error) return '';

  if (Array.isArray(error.message)) return error.message.join(', ');

  return i18n.t(`ErrorTypes.${error.message}`);
};

export const camelToSentence = (str: string): string => {
  return str
    .replace(/([A-Z])/g, (m) => ` ${m}`)
    .replace(/^./, (m) => m.toUpperCase())
    .trim();
};

export const thirtyIds = Array(30)
  .fill(null)
  .map(() => ({
    id: nanoid(),
  }));

export const ceilTime = (time: Date | string | number, minutes = 30): Date => {
  const timeToReturn = new Date(time);

  timeToReturn.setMilliseconds(
    Math.ceil(timeToReturn.getMilliseconds() / 1000) * 1000
  );
  timeToReturn.setSeconds(Math.ceil(timeToReturn.getSeconds() / 60) * 60);
  timeToReturn.setMinutes(
    Math.ceil((timeToReturn.getMinutes() + 1) / minutes) * minutes
  );
  return timeToReturn;
};

export const nameToSubdomain = (name: string): string =>
  name
    .replaceAll('Ğ', 'G')
    .replaceAll('Ü', 'U')
    .replaceAll('Ş', 'S')
    .replaceAll('İ', 'I')
    .replaceAll('Ö', 'O')
    .replaceAll('Ç', 'C')
    .replaceAll('ğ', 'g')
    .replaceAll('ü', 'u')
    .replaceAll('ş', 's')
    .replaceAll('ı', 'i')
    .replaceAll('ö', 'o')
    .replaceAll('ç', 'c')
    .replaceAll(' ', '-')
    .replaceAll(/[^\w\s]/gi, '')
    .toLowerCase();

export const fetchOrProduceNull = async <T>(
  request: () => Promise<T>
): Promise<T | null> => {
  try {
    const result = await request();
    return result;
  } catch (err: any) {
    return null;
  }
};

export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

export const getColorPairFromId = (id: string): typeof colorPair[0] => {
  console.log(id);
  return colorPair[5 % colorPair.length];
};

export const matchDescriptionTags = /(#\w+)/gi;

export const getChatRoomName = (
  id: string,
  medium: 'post' | 'direct' | 'channel' = 'direct'
): string => `${medium}_${id}`;

export const getFileKey = (file: File): string =>
  `${file.name}_${file.size}_${file.type}`;

export const getTimezoneTimeFromUTC = (date: string | Date): Dayjs => {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return dayjs.tz(date, currentTimezone);
};

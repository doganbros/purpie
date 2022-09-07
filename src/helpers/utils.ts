import { nanoid } from 'nanoid';
import { ResponseError } from '../models/response-error';
import colorPair from '../styles/color-pairs.json';

export const errorResponseMessage = (error?: ResponseError): string => {
  if (!error) return '';

  if (Array.isArray(error.message)) return error.message.join(', ');

  return error.message;
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
  name.toLowerCase().replaceAll(' ', '-');

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

export const getColorPairFromId = (id: number): typeof colorPair[0] =>
  colorPair[id % colorPair.length];

export const matchDescriptionTags = /(#\w+)/gi;

export const getChatRoomName = (
  id: number,
  medium: 'post' | 'direct' | 'channel' = 'direct'
): string => `${medium}_${id}`;

export const getFileKey = (file: File): string =>
  `${file.name}_${file.size}_${file.type}`;

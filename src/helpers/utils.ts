import { nanoid } from 'nanoid';
import { ResponseError } from '../models/response-error';

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
  } catch (err) {
    return null;
  }
};

export const randomInt = (max: number): number =>
  Math.floor(Math.random() * max);

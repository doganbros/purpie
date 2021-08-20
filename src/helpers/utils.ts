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

export const padString = (
  str: string,
  padChar: string,
  length: number,
  padLeft = true
): string => {
  const pad = Array(length).fill(padChar);

  if (padLeft) return (pad + str).slice(-pad.length);

  return (str + pad).substring(0, pad.length);
};

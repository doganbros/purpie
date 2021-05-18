import { ResponseError } from '../models/response-error';

export const errorResponseMessage = (error?: ResponseError): string => {
  if (!error) return '';
  return typeof error.message === 'string'
    ? error.message
    : error.message.join(', ');
};

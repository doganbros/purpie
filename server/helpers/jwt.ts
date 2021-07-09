import jwt, { SignOptions } from 'jsonwebtoken';

export const generateJWT = (
  payload: Record<string, any>,
  secret: string,
  options: SignOptions = {},
): Promise<string> => {
  return new Promise((res, rej) => {
    jwt.sign(payload, secret, options, (err, value) => {
      if (err) return rej(err);
      if (!value) return rej(new Error('No Token could be generated'));
      return res(value);
    });
  });
};

export const verifyJWT = (
  token: string,
  secret: string,
): Promise<Record<string, any>> => {
  return new Promise((res, rej) => {
    jwt.verify(token, secret, (err, payload) => {
      if (err) return rej(err);
      if (!payload) return rej(new Error('Couldnt retrieve value'));
      return res(payload);
    });
  });
};

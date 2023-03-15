import jwt, { SignOptions } from 'jsonwebtoken';

const { NODE_ENV = 'development' } = process.env;

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

export const getJWTCookieKeys = (): {
  accessTokenKey: string;
  refreshAccessTokenKey: string;
} => {
  return {
    accessTokenKey: `PURPIE_${NODE_ENV.toUpperCase()}_ACCESS_TOKEN`,
    refreshAccessTokenKey: `PURPIE_${NODE_ENV.toUpperCase()}_REFRESH_ACCESS_TOKEN`,
  };
};

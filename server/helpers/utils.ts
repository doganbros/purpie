import dotEnv from 'dotenv';
import path from 'path';

export const loadEnv = (defaultPath?: string) => {
  const envPath =
    defaultPath ?? path.resolve(__dirname, '..', '..', '..', '.env');
  dotEnv.config({ path: envPath });
  return envPath;
};

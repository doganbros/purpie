import { http } from '../../config/http';

import { ApiKeySecret } from '../types/api.types';

export const getApiKeyAndSecret = async (): Promise<ApiKeySecret> =>
  http
    .get('/auth/api/credentials', {
      showErrorToast: (err) => err?.response?.data?.message !== 'UNAUTHORIZED',
    })
    .then((res) => res.data);

export const generateApiKeyAndSecret = async (): Promise<ApiKeySecret> =>
  http
    .post(
      '/auth/api/generate',
      {},
      {
        showErrorToast: (err) =>
          err?.response?.data?.message !== 'UNAUTHORIZED',
      }
    )
    .then((res) => res.data);

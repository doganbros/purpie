import axios from 'axios';
import { nanoid } from 'nanoid';
import { appSubdomain } from '../helpers/app-subdomain';
import { errorResponseMessage, getCookie } from '../helpers/utils';
import { REMOVE_TOAST } from '../store/constants/util.constants';
import { store } from '../store/store';

export const {
  NODE_ENV = 'development',
  REACT_APP_API_VERSION = 'v1',
  REACT_APP_SERVER_HOST = 'http://localhost:8000',
} = process.env;

export const apiURL = `${REACT_APP_SERVER_HOST}/${REACT_APP_API_VERSION}`;

axios.defaults.baseURL = apiURL;

axios.defaults.withCredentials = true;

if (appSubdomain) {
  axios.interceptors.request.use(
    (config) => {
      const { headers } = config;

      headers['App-Subdomain'] = appSubdomain;

      return config;
    },
    (err) => Promise.reject(err)
  );
}

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const showErrorToast = error?.response.config?.showErrorToast;
    if (error?.response?.data?.message === 'NOT_SIGNED_IN') {
      store.dispatch({ type: 'LOGOUT' });
    } else if (showErrorToast ? showErrorToast(error) : true) {
      const toastId = nanoid();

      if (
        error &&
        error?.response.status === 401 &&
        !getCookie(`PURPIE_${NODE_ENV.toUpperCase()}_REFRESH_ACCESS_TOKEN`)
      ) {
        if (error?.response?.data?.message === 'MUST_VERIFY_EMAIL')
          return Promise.reject(error);
        return Promise.reject();
      }

      if (error.response.data.message !== 'ZONE_SUBDOMAIN_ALREADY_EXIST')
        store.dispatch({
          type: 'SET_TOAST',
          payload: {
            toastId,
            status: 'error',
            message: errorResponseMessage(error?.response?.data || error),
          },
        });

      setTimeout(() => {
        store.dispatch({
          type: REMOVE_TOAST,
          payload: toastId,
        });
      }, 5000);
    }

    return Promise.reject(error);
  }
);

export const http = axios;

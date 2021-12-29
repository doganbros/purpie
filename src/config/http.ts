import axios from 'axios';
import { nanoid } from 'nanoid';
import { appSubdomain } from '../helpers/app-subdomain';
import { errorResponseMessage } from '../helpers/utils';
import { REMOVE_TOAST } from '../store/constants/util.constants';
import { store } from '../store/store';

const {
  REACT_APP_API_VERSION = 'v1',
  REACT_APP_SERVER_HOST = 'http://localhost:8000',
} = process.env;

axios.defaults.baseURL = `${REACT_APP_SERVER_HOST}/${REACT_APP_API_VERSION}`;

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

    if (error?.response?.data?.error === 'NOT_SIGNED_IN') {
      store.dispatch({ type: 'LOGOUT' });
    } else if (showErrorToast ? showErrorToast(error) : true) {
      const toastId = nanoid();

      // eslint-disable-next-line no-console
      console.error(error);
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

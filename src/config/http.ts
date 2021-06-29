import axios from 'axios';
import { nanoid } from 'nanoid';
import { errorResponseMessage } from '../helpers/utils';
import { REMOVE_TOAST } from '../store/constants/util.constants';
import { store } from '../store/store';

const {
  REACT_APP_API_VERSION = 'v1',
  REACT_APP_SERVER_HOST = 'http://localhost:8000',
} = process.env;

const [subdomain] = window.location.hostname.split('.');

const serverHostUrl = new URL(REACT_APP_SERVER_HOST);

const isValidSubDomain =
  window.location.hostname !== serverHostUrl.hostname &&
  subdomain !== 'www' &&
  window.location.hostname.split('.').length ===
    serverHostUrl.hostname.split('.').length + 1;

axios.defaults.baseURL = `${REACT_APP_SERVER_HOST}/${REACT_APP_API_VERSION}`;

axios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    const { headers } = config;
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

    if (isValidSubDomain) headers['App-Subdomain'] = subdomain;

    return config;
  },
  (err) => Promise.reject(err)
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error?.response?.status === 401 &&
      error?.response?.data.message === 'Invalid token'
    )
      store.dispatch({ type: 'LOGOUT' });
    else {
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

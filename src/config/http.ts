import axios from 'axios';
import { nanoid } from 'nanoid';
import { errorResponseMessage } from '../helpers/utils';
import { REMOVE_TOAST } from '../store/constants/util.constants';
import { store } from '../store/store';

const { REACT_APP_API_VERSION = 'v1' } = process.env;

const domain = new URL(window.location.href);
const subdomain = domain?.host.split('.')[1];
let REACT_APP_BASE_URL;
switch (process.env.NODE_ENV) {
  case 'development':
    REACT_APP_BASE_URL = `http://${subdomain}.localhost:8000`; // 'http://jadmin-test.localhost:8000';
    break;
  case 'production':
    REACT_APP_BASE_URL = `http://${subdomain}.doganbros.com/api`; //  'http://jadmin-test.doganbros.com/api';
    break;
  case 'test':
    REACT_APP_BASE_URL = `http://${subdomain}.doganbros.com/api`; //  'http://jadmin-test.doganbros.com/api';
    break;
  default:
    break;
}
axios.defaults.baseURL = `${REACT_APP_BASE_URL}/${REACT_APP_API_VERSION}`;

axios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      const { headers } = config;
      headers.Authorization = `Bearer ${accessToken}`;
    }
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
      store.dispatch({
        type: 'SET_TOAST',
        payload: {
          toastId,
          status: 'error',
          message: errorResponseMessage(error?.response?.data),
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

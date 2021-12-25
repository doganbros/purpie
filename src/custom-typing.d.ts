import { AxiosRequestConfig as DefaultAxiosRequestConfig } from 'axios';

declare module 'axios' {
  interface AxiosRequestConfig extends DefaultAxiosRequestConfig {
    showErrorToast?: (err: any) => boolean;
  }
}

/* eslint-disable no-var */
/* eslint-disable vars-on-top */
import { AxiosRequestConfig as DefaultAxiosRequestConfig } from 'axios';

declare module 'axios' {
  interface AxiosRequestConfig extends DefaultAxiosRequestConfig {
    showErrorToast?: (err: any) => boolean;
  }
}

declare global {
  var JitsiMeetJS: any;
}

export {};

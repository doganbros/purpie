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

  interface Window {
    ethereum: {
      isMetaMask?: boolean;
      request: (request: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (
        event: string,
        callback: (...args: any[]) => void
      ) => void;
    };
  }
}

export {};

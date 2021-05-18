import { REMOVE_TOAST, SET_TOAST } from '../constants/util.constants';

export type ToastStatus = 'ok' | 'error' | 'info';
export interface UtilState {
  toast: {
    status?: ToastStatus;
    message?: string;
    visible: boolean;
    toastId?: string;
  };
}

export type UtilActionParams =
  | {
      type: typeof SET_TOAST;
      payload: { status: ToastStatus; message: string; toastId?: string };
    }
  | {
      type: typeof REMOVE_TOAST;
      payload?: string;
    };

export interface UtilDispatch {
  (dispatch: UtilActionParams): void;
}

export interface UtilAction {
  (dispatch: UtilDispatch): void | Promise<void>;
}

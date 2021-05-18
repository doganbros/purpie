import { nanoid } from 'nanoid';
import { REMOVE_TOAST, SET_TOAST } from '../constants/util.constants';
import { ToastStatus, UtilAction } from '../types/util.types';

export const setToastAction = (
  status: ToastStatus,
  message: string,
  timeOut = 5000,
  toastId?: string
): UtilAction => {
  return (dispatch) => {
    const id = toastId || nanoid();
    dispatch({
      type: SET_TOAST,
      payload: {
        status,
        toastId: id,
        message,
      },
    });

    if (timeOut) {
      setTimeout(() => {
        dispatch({
          type: REMOVE_TOAST,
          payload: id,
        });
      }, timeOut);
    }
  };
};

export const removeToastAction = {
  type: REMOVE_TOAST,
};

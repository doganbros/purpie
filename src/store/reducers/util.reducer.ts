import { REMOVE_TOAST, SET_TOAST } from '../constants/util.constants';
import { UtilActionParams, UtilState } from '../types/util.types';

const initialState: UtilState = {
  toast: {
    visible: false,
  },
};

const utilReducer = (
  state = initialState,
  action: UtilActionParams
): UtilState => {
  switch (action.type) {
    case SET_TOAST:
      return {
        ...state,
        toast: {
          visible: true,
          toastId: action.payload.toastId,
          status: action.payload.status,
          message: action.payload.message,
        },
      };

    case REMOVE_TOAST:
      if (!action.payload || state.toast.toastId === action.payload)
        return {
          ...state,
          toast: {
            visible: false,
          },
        };
      return state;
    default:
      return state;
  }
};

export default utilReducer;

import {
  API_KEY_SECRET_FAILED,
  API_KEY_SECRET_REQUESTED,
  API_KEY_SECRET_SUCCESS,
  GENERATE_API_KEY_SECRET_FAILED,
  GENERATE_API_KEY_SECRET_REQUESTED,
  GENERATE_API_KEY_SECRET_SUCCESS,
} from '../constants/api.constants';
import * as ApiService from '../services/api.service';
import { ApiAction } from '../types/api.types';

export const getApiKeyAndSecretAction = (): ApiAction => {
  return async (dispatch) => {
    dispatch({ type: API_KEY_SECRET_REQUESTED });
    try {
      const payload = await ApiService.getApiKeyAndSecret();
      dispatch({ type: API_KEY_SECRET_SUCCESS, payload });
    } catch (err: any) {
      dispatch({ type: API_KEY_SECRET_FAILED, payload: err?.response?.data });
    }
  };
};

export const generateApiKeyAndSecretAction = (): ApiAction => {
  return async (dispatch) => {
    dispatch({ type: GENERATE_API_KEY_SECRET_REQUESTED });
    try {
      const payload = await ApiService.generateApiKeyAndSecret();
      dispatch({ type: GENERATE_API_KEY_SECRET_SUCCESS, payload });
    } catch (err: any) {
      dispatch({
        type: GENERATE_API_KEY_SECRET_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

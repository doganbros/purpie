import appHistory from '../../helpers/history';
import {
  FORGOT_PASSWORD_FAILED,
  FORGOT_PASSWORD_REQUESTED,
  FORGOT_PASSWORD_SUCCESS,
  LOGIN_FAILED,
  LOGIN_REQUESTED,
  LOGIN_SUCCESS,
  REGISTER_FAILED,
  REGISTER_REQUESTED,
  REGISTER_SUCCESS,
  RESET_PASSWORD_FAILED,
  RESET_PASSWORD_REQUESTED,
  RESET_PASSWORD_SUCCESS,
  LOGOUT,
  USER_RETRIEVED_SUCCESS,
  USER_RETRIEVED_FAILED,
  THIRD_PARTY_URL_REQUESTED,
  THIRD_PARTY_URL_FAILED,
  THIRD_PARTY_AUTH_WITH_CODE_REQUESTED,
  THIRD_PARTY_AUTH_WITH_CODE_FAILED,
  THIRD_PARTY_AUTH_WITH_CODE_SUCCESS,
} from '../constants/auth.constants';
import * as AuthService from '../services/auth.service';
import {
  AuthAction,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from '../types/auth.types';

export const loginAction = (user: LoginPayload): AuthAction => {
  return async (dispatch) => {
    dispatch({
      type: LOGIN_REQUESTED,
    });
    try {
      const payload = await AuthService.login(user);
      dispatch({
        type: LOGIN_SUCCESS,
        payload,
      });
    } catch (err) {
      dispatch({
        type: LOGIN_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const retieveUserAction = (): AuthAction => {
  return async (dispatch) => {
    try {
      const payload = await AuthService.retrieveUser();
      dispatch({
        type: USER_RETRIEVED_SUCCESS,
        payload,
      });
    } catch (err) {
      dispatch({
        type: USER_RETRIEVED_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const getThirdPartyUrlAction = (name: string): AuthAction => {
  return async (dispatch) => {
    dispatch({
      type: THIRD_PARTY_URL_REQUESTED,
      payload: name,
    });

    try {
      const url = await AuthService.getThirdPartyUrl(name);

      window.location.href = url;
    } catch (err) {
      dispatch({
        type: THIRD_PARTY_URL_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const authenticateWithThirdPartyCodeAction = (
  name: string,
  code: string
): AuthAction => {
  return async (dispatch) => {
    dispatch({
      type: THIRD_PARTY_AUTH_WITH_CODE_REQUESTED,
    });

    try {
      const payload = await AuthService.authenticateWithThirdPartyCode(
        name,
        code
      );
      dispatch({
        type: THIRD_PARTY_AUTH_WITH_CODE_SUCCESS,
        payload,
      });
    } catch (err) {
      dispatch({
        type: THIRD_PARTY_AUTH_WITH_CODE_FAILED,
        payload: err?.response?.data,
      });
      appHistory.push('/login');
    }
  };
};

export const logoutAction = {
  type: LOGOUT,
};

export const registerAction = (user: RegisterPayload): AuthAction => {
  return async (dispatch) => {
    dispatch({
      type: REGISTER_REQUESTED,
    });
    try {
      const payload = await AuthService.register(user);
      dispatch({
        type: REGISTER_SUCCESS,
        payload,
      });
    } catch (err) {
      dispatch({
        type: REGISTER_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const forgetPasswordAction = (email: string): AuthAction => {
  return async (dispatch) => {
    dispatch({
      type: FORGOT_PASSWORD_REQUESTED,
    });
    try {
      await AuthService.forgetPassword(email);
      dispatch({
        type: FORGOT_PASSWORD_SUCCESS,
      });
      appHistory.push('/login');
    } catch (err) {
      dispatch({
        type: FORGOT_PASSWORD_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const resetPasswordAction = (body: ResetPasswordPayload): AuthAction => {
  return async (dispatch) => {
    dispatch({
      type: RESET_PASSWORD_REQUESTED,
    });
    try {
      await AuthService.resetPassword(body);
      dispatch({
        type: RESET_PASSWORD_SUCCESS,
      });
      appHistory.push('/login');
    } catch (err) {
      dispatch({
        type: RESET_PASSWORD_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

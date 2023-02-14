import i18n from '../../config/i18n/i18n-config';
import { navigateToSubdomain } from '../../helpers/app-subdomain';
import appHistory from '../../helpers/history';
import {
  FORGOT_PASSWORD_FAILED,
  FORGOT_PASSWORD_REQUESTED,
  FORGOT_PASSWORD_SUCCESS,
  INITIALIZE_USER_FAILED,
  INITIALIZE_USER_REQUESTED,
  INITIALIZE_USER_SUCCESS,
  LOGIN_FAILED,
  LOGIN_REQUESTED,
  LOGIN_SUCCESS,
  LOGOUT,
  MUST_SET_INITIAL_USER,
  REGISTER_FAILED,
  REGISTER_REQUESTED,
  REGISTER_SUCCESS,
  RESEND_MAIL_VERIFICATION_TOKEN_FAILED,
  RESEND_MAIL_VERIFICATION_TOKEN_REQUESTED,
  RESEND_MAIL_VERIFICATION_TOKEN_SUCCESS,
  RESET_PASSWORD_FAILED,
  RESET_PASSWORD_REQUESTED,
  RESET_PASSWORD_SUCCESS,
  THIRD_PARTY_AUTH_WITH_CODE_FAILED,
  THIRD_PARTY_AUTH_WITH_CODE_REQUESTED,
  THIRD_PARTY_AUTH_WITH_CODE_SUCCESS,
  UPDATE_PASSWORD_FAILED,
  UPDATE_PASSWORD_REQUESTED,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PROFILE_INFO_FAILED,
  UPDATE_PROFILE_INFO_REQUESTED,
  UPDATE_PROFILE_INFO_SUCCESS,
  UPDATE_PROFILE_PHOTO_FAILED,
  UPDATE_PROFILE_PHOTO_REQUESTED,
  UPDATE_PROFILE_PHOTO_SUCCESS,
  USER_RETRIEVED_FAILED,
  USER_RETRIEVED_SUCCESS,
  VERIFY_USER_EMAIL_FAILED,
  VERIFY_USER_EMAIL_REQUESTED,
  VERIFY_USER_EMAIL_SUCCESS,
} from '../constants/auth.constants';
import * as AuthService from '../services/auth.service';
import {
  AuthAction,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  UpdatePasswordPayload,
  UpdateProfileInfoPayload,
  VerifyEmailPayload,
} from '../types/auth.types';
import { setToastAction } from './util.action';

const { REACT_APP_SERVER_HOST } = process.env;

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
    } catch (err: any) {
      dispatch({
        type: LOGIN_FAILED,
        payload: err?.response?.data,
      });
      if (err?.response?.data?.message === 'MUST_VERIFY_EMAIL') {
        appHistory.push(`/verify-email-info/${err?.response?.data.user.id}`);
      }
    }
  };
};

export const retrieveUserAction = (): AuthAction => {
  return async (dispatch) => {
    try {
      const payload = await AuthService.retrieveUser();
      dispatch({
        type: USER_RETRIEVED_SUCCESS,
        payload,
      });
    } catch (err: any) {
      if (err?.response?.data?.message === 'INITIAL_USER_REQUIRED') {
        return dispatch({ type: MUST_SET_INITIAL_USER });
      }
      dispatch({
        type: USER_RETRIEVED_FAILED,
        payload: err?.response?.data,
      });
    }
    return null;
  };
};

export const verifyUserEmailAction = (body: VerifyEmailPayload): AuthAction => {
  return async (dispatch) => {
    try {
      dispatch({
        type: VERIFY_USER_EMAIL_REQUESTED,
      });
      const payload = await AuthService.verifyUserEmail(body);
      setToastAction(
        'ok',
        i18n.t('ToastsMessages.emailVerified', { email: payload.email })
      )(dispatch);
      appHistory.replace('/login');
      dispatch({
        type: VERIFY_USER_EMAIL_SUCCESS,
        payload,
      });
    } catch (err: any) {
      dispatch({
        type: VERIFY_USER_EMAIL_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const getThirdPartyUrlAction = (name: string): AuthAction => {
  return async () => {
    window.location.href = `${REACT_APP_SERVER_HOST}/v1/auth/third-party/${name}`;
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
    } catch (err: any) {
      dispatch({
        type: THIRD_PARTY_AUTH_WITH_CODE_FAILED,
        payload: err?.response?.data,
      });
      appHistory.replace('/login');
    }
  };
};

export const logoutAction = (inZoneSubdomain: boolean): AuthAction => {
  return async (dispatch) => {
    await AuthService.logOut();
    if (inZoneSubdomain) await navigateToSubdomain();
    dispatch({
      type: LOGOUT,
    });
  };
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
      appHistory.push(`/verify-email-info/${payload.id}`);
    } catch (err: any) {
      dispatch({
        type: REGISTER_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const resetPasswordRequestAction = (email: string): AuthAction => {
  return async (dispatch) => {
    dispatch({
      type: FORGOT_PASSWORD_REQUESTED,
    });
    try {
      await AuthService.resetPasswordRequest(email);
      dispatch({
        type: FORGOT_PASSWORD_SUCCESS,
      });
      setToastAction(
        'ok',
        i18n.t('ToastMessages.passwordResetLinkSent', { email })
      )(dispatch);
      appHistory.replace('/login');
    } catch (err: any) {
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
      setToastAction(
        'ok',
        i18n.t('ToastMessages.passwordResetSuccess')
      )(dispatch);
      appHistory.replace('/login');
    } catch (err: any) {
      dispatch({
        type: RESET_PASSWORD_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};
export const resendMailVerificationTokenAction = (
  userId: string
): AuthAction => {
  return async (dispatch) => {
    dispatch({
      type: RESEND_MAIL_VERIFICATION_TOKEN_REQUESTED,
    });
    try {
      await AuthService.resendMailVerificationToken(userId);
      dispatch({
        type: RESEND_MAIL_VERIFICATION_TOKEN_SUCCESS,
      });
      setToastAction(
        'ok',
        i18n.t('ToastMessages.verificationEmailSent')
      )(dispatch);
      appHistory.replace('/login');
    } catch (err: any) {
      dispatch({
        type: RESEND_MAIL_VERIFICATION_TOKEN_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};
export const initializeUserAction = (user: RegisterPayload): AuthAction => {
  return async (dispatch) => {
    dispatch({
      type: INITIALIZE_USER_REQUESTED,
    });
    try {
      const payload = await AuthService.initializeUser(user);
      dispatch({
        type: INITIALIZE_USER_SUCCESS,
        payload,
      });
      appHistory.replace('/');
    } catch (err: any) {
      dispatch({
        type: INITIALIZE_USER_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const updateProfileInfoAction = (
  user: UpdateProfileInfoPayload
): AuthAction => {
  return async (dispatch) => {
    dispatch({
      type: UPDATE_PROFILE_INFO_REQUESTED,
    });
    try {
      await AuthService.updateProfileInfo(user);
      setToastAction('ok', i18n.t('settings.changesSaved'))(dispatch);
      dispatch({
        type: UPDATE_PROFILE_INFO_SUCCESS,
        payload: user,
      });
    } catch (err: any) {
      dispatch({
        type: UPDATE_PROFILE_INFO_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const updateProfilePhotoAction = (profilePhoto: File): AuthAction => {
  return async (dispatch) => {
    dispatch({
      type: UPDATE_PROFILE_PHOTO_REQUESTED,
    });
    try {
      const payload = await AuthService.updateProfilePhoto(profilePhoto);
      setToastAction('ok', i18n.t('settings.changesSaved'))(dispatch);
      dispatch({
        type: UPDATE_PROFILE_PHOTO_SUCCESS,
        payload,
      });
    } catch (err: any) {
      dispatch({
        type: UPDATE_PROFILE_PHOTO_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const updatePasswordAction = (
  password: UpdatePasswordPayload
): AuthAction => {
  return async (dispatch) => {
    dispatch({
      type: UPDATE_PASSWORD_REQUESTED,
    });
    try {
      const payload = await AuthService.updatePassword(password);
      setToastAction('ok', i18n.t('settings.passwordChanged'))(dispatch);
      dispatch({
        type: UPDATE_PASSWORD_SUCCESS,
        payload,
      });
    } catch (err: any) {
      dispatch({
        type: UPDATE_PASSWORD_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

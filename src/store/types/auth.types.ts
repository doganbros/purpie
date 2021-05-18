import { ResponseError } from '../../models/response-error';
import {
  LOGIN_REQUESTED,
  RESET_PASSWORD_REQUESTED,
  FORGOT_PASSWORD_REQUESTED,
  REGISTER_REQUESTED,
  LOGIN_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAILED,
  RESET_PASSWORD_FAILED,
  LOGIN_FAILED,
  FORGOT_PASSWORD_FAILED,
  RESET_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_SUCCESS,
  LOGOUT,
  USER_RETRIEVED_SUCCESS,
  USER_RETRIEVED_FAILED,
  THIRD_PARTY_URL_REQUESTED,
  THIRD_PARTY_URL_FAILED,
  THIRD_PARTY_AUTH_WITH_CODE_REQUESTED,
  THIRD_PARTY_AUTH_WITH_CODE_FAILED,
  THIRD_PARTY_AUTH_WITH_CODE_SUCCESS,
} from '../constants/auth.constants';

export type UserRole = 'user' | 'admin' | 'superadmin';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  retrieveUser: {
    loading: boolean;
    error: ResponseError | null;
  };
  login: {
    loading: boolean;
    error: ResponseError | null;
  };
  register: {
    loading: boolean;
    error: ResponseError | null;
  };
  loginWithGoogle: {
    buttonLoading: boolean;
    authenticating: boolean;
    error: ResponseError | null;
  };
  loginWithFacebook: {
    buttonLoading: boolean;
    authenticating: boolean;
    error: ResponseError | null;
  };
  forgotPassword: {
    loading: boolean;
    error: ResponseError | null;
  };
  resetPassword: {
    loading: boolean;
    error: ResponseError | null;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ResetPasswordPayload {
  password: string;
  token: string;
}

export type AuthActionParams =
  | {
      type:
        | typeof LOGIN_REQUESTED
        | typeof REGISTER_REQUESTED
        | typeof FORGOT_PASSWORD_REQUESTED
        | typeof THIRD_PARTY_AUTH_WITH_CODE_REQUESTED
        | typeof RESET_PASSWORD_REQUESTED
        | typeof FORGOT_PASSWORD_SUCCESS
        | typeof LOGOUT
        | typeof RESET_PASSWORD_SUCCESS;
    }
  | {
      type: typeof THIRD_PARTY_URL_REQUESTED;
      payload: string;
    }
  | {
      type:
        | typeof LOGIN_SUCCESS
        | typeof REGISTER_SUCCESS
        | typeof THIRD_PARTY_AUTH_WITH_CODE_SUCCESS
        | typeof USER_RETRIEVED_SUCCESS;
      payload: User;
    }
  | {
      type: typeof LOGIN_SUCCESS | typeof REGISTER_SUCCESS;
      payload: User;
    }
  | {
      type:
        | typeof LOGIN_FAILED
        | typeof REGISTER_FAILED
        | typeof RESET_PASSWORD_FAILED
        | typeof THIRD_PARTY_URL_FAILED
        | typeof THIRD_PARTY_AUTH_WITH_CODE_FAILED
        | typeof USER_RETRIEVED_FAILED
        | typeof FORGOT_PASSWORD_FAILED;
      payload: ResponseError;
    };

export interface AuthDispatch {
  (dispatch: AuthActionParams): void;
}

export interface AuthAction {
  (dispatch: AuthDispatch): Promise<void>;
}

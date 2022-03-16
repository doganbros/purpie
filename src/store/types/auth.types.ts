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
  VERIFY_USER_EMAIL_REQUESTED,
  VERIFY_USER_EMAIL_SUCCESS,
  VERIFY_USER_EMAIL_FAILED,
  RESEND_MAIL_VERIFICATION_TOKEN_REQUESTED,
  RESEND_MAIL_VERIFICATION_TOKEN_SUCCESS,
  RESEND_MAIL_VERIFICATION_TOKEN_FAILED,
  MUST_SET_INITIAL_USER,
  INITIALIZE_USER_REQUESTED,
  INITIALIZE_USER_SUCCESS,
  INITIALIZE_USER_FAILED,
} from '../constants/auth.constants';
import { UtilActionParams } from './util.types';

export type UserRoleCode = 'SUPER_ADMIN' | 'ADMIN' | 'NORMAL';

export interface ExistenceResult {
  userName: string;
  exists: boolean;
  suggestions: Array<string>;
}

export interface UserRole {
  roleCode: UserRoleCode;
  roleName: string;
  isSystemRole: boolean;
  canCreateZone: boolean;
  canCreateClient: boolean;
  canManageRole: boolean;
}

export interface UserBasic {
  id: number;
  firstName: string;
  userName: string;
  lastName: string;
  email: string;
}

export interface User extends UserBasic {
  mattermostId: string;
  mattermostToken: string;
  userRole?: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialUserSetup: boolean;
  verifyUserEmail: {
    loading: boolean;
    error: ResponseError | null;
  };
  resendMailVerificationToken: {
    loading: boolean;
    error: ResponseError | null;
  };
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
  initializeUser: {
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
  emailOrUserName: string;
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

export interface VerifyEmailPayload {
  token: string;
  userName: string;
}

export type AuthActionParams =
  | {
      type:
        | typeof LOGIN_REQUESTED
        | typeof MUST_SET_INITIAL_USER
        | typeof VERIFY_USER_EMAIL_REQUESTED
        | typeof REGISTER_REQUESTED
        | typeof RESEND_MAIL_VERIFICATION_TOKEN_REQUESTED
        | typeof FORGOT_PASSWORD_REQUESTED
        | typeof THIRD_PARTY_AUTH_WITH_CODE_REQUESTED
        | typeof RESET_PASSWORD_REQUESTED
        | typeof FORGOT_PASSWORD_SUCCESS
        | typeof RESEND_MAIL_VERIFICATION_TOKEN_SUCCESS
        | typeof LOGOUT
        | typeof RESET_PASSWORD_SUCCESS
        | typeof INITIALIZE_USER_REQUESTED;
    }
  | {
      type: typeof THIRD_PARTY_URL_REQUESTED;
      payload: string;
    }
  | {
      type:
        | typeof LOGIN_SUCCESS
        | typeof REGISTER_SUCCESS
        | typeof VERIFY_USER_EMAIL_SUCCESS
        | typeof THIRD_PARTY_AUTH_WITH_CODE_SUCCESS
        | typeof USER_RETRIEVED_SUCCESS
        | typeof INITIALIZE_USER_SUCCESS;
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
        | typeof VERIFY_USER_EMAIL_FAILED
        | typeof THIRD_PARTY_URL_FAILED
        | typeof THIRD_PARTY_AUTH_WITH_CODE_FAILED
        | typeof RESEND_MAIL_VERIFICATION_TOKEN_FAILED
        | typeof USER_RETRIEVED_FAILED
        | typeof FORGOT_PASSWORD_FAILED
        | typeof INITIALIZE_USER_FAILED;
      payload: ResponseError;
    };

export interface AuthDispatch {
  (dispatch: AuthActionParams | UtilActionParams): void;
}

export interface AuthAction {
  (dispatch: AuthDispatch): Promise<void | null>;
}

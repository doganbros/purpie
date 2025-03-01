import {
  UPDATE_PROFILE_PHOTO_FAILED,
  UPDATE_PROFILE_PHOTO_REQUESTED,
  UPDATE_PROFILE_PHOTO_SUCCESS,
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
  UPDATE_PROFILE_INFO_FAILED,
  UPDATE_PROFILE_INFO_SUCCESS,
  UPDATE_PROFILE_INFO_REQUESTED,
  UPDATE_PASSWORD_REQUESTED,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAILED,
  COMPLETE_PROFILE_REQUESTED,
  COMPLETE_PROFILE_SUCCESS,
  COMPLETE_PROFILE_FAILED,
  LOGIN_WITH_METAMASK_FAILED,
  LOGIN_WITH_METAMASK_REQUESTED,
  LOGIN_WITH_METAMASK_SUCCESS,
  REGISTER_WITH_METAMASK_FAILED,
  REGISTER_WITH_METAMASK_REQUESTED,
  REGISTER_WITH_METAMASK_SUCCESS,
} from '../constants/auth.constants';
import { ResponseError } from '../../models/response-error';

import { UtilActionParams } from './util.types';

export type UserRoleCode = 'SUPER_ADMIN' | 'ADMIN' | 'NORMAL';

export interface ExistenceResult {
  userName: string;
  exists: boolean;
  suggestions: Array<string>;
}

export interface SignInResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
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
  id: string;
  fullName: string;
  userName: string;
  email: string;
  displayPhoto?: string;
  contactUserId?: string | null;
  invited?: boolean;
}

export interface User extends UserBasic {
  userRole?: UserRole;
  fullName: string;
  isInContact?: boolean;
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
  forgotPassword: {
    loading: boolean;
    error: ResponseError | null;
  };
  resetPassword: {
    loading: boolean;
    error: ResponseError | null;
  };
  loginWithMetamask: {
    loading: boolean;
    error: ResponseError | null;
  };
  registerWithMetamask: {
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
  fullName: string;
}

export interface ResetPasswordPayload {
  password: string;
  token: string;
}

export interface VerifyEmailPayload {
  token: string;
  userName: string;
}

export interface CompleteProfilePayload {
  token: string;
  userName: string;
}

export interface UpdateProfileInfoPayload {
  userName: string;
  fullName: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export type AuthActionParams =
  | {
      type:
        | typeof LOGIN_REQUESTED
        | typeof MUST_SET_INITIAL_USER
        | typeof VERIFY_USER_EMAIL_REQUESTED
        | typeof COMPLETE_PROFILE_REQUESTED
        | typeof REGISTER_REQUESTED
        | typeof RESEND_MAIL_VERIFICATION_TOKEN_REQUESTED
        | typeof FORGOT_PASSWORD_REQUESTED
        | typeof THIRD_PARTY_AUTH_WITH_CODE_REQUESTED
        | typeof RESET_PASSWORD_REQUESTED
        | typeof FORGOT_PASSWORD_SUCCESS
        | typeof RESEND_MAIL_VERIFICATION_TOKEN_SUCCESS
        | typeof LOGOUT
        | typeof RESET_PASSWORD_SUCCESS
        | typeof INITIALIZE_USER_REQUESTED
        | typeof UPDATE_PROFILE_INFO_REQUESTED
        | typeof UPDATE_PROFILE_PHOTO_REQUESTED
        | typeof UPDATE_PASSWORD_REQUESTED;
    }
  | {
      type:
        | typeof THIRD_PARTY_URL_REQUESTED
        | typeof UPDATE_PROFILE_PHOTO_SUCCESS
        | typeof UPDATE_PASSWORD_SUCCESS;
      payload: string;
    }
  | {
      type:
        | typeof LOGIN_SUCCESS
        | typeof REGISTER_SUCCESS
        | typeof VERIFY_USER_EMAIL_SUCCESS
        | typeof COMPLETE_PROFILE_SUCCESS
        | typeof THIRD_PARTY_AUTH_WITH_CODE_SUCCESS
        | typeof USER_RETRIEVED_SUCCESS
        | typeof INITIALIZE_USER_SUCCESS;
      payload: User;
    }
  | {
      type: typeof UPDATE_PROFILE_INFO_SUCCESS;
      payload: { userName: string; fullName: string };
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
        | typeof COMPLETE_PROFILE_FAILED
        | typeof THIRD_PARTY_URL_FAILED
        | typeof THIRD_PARTY_AUTH_WITH_CODE_FAILED
        | typeof RESEND_MAIL_VERIFICATION_TOKEN_FAILED
        | typeof USER_RETRIEVED_FAILED
        | typeof FORGOT_PASSWORD_FAILED
        | typeof INITIALIZE_USER_FAILED
        | typeof UPDATE_PROFILE_INFO_FAILED
        | typeof UPDATE_PROFILE_PHOTO_FAILED
        | typeof UPDATE_PASSWORD_FAILED;
      payload: ResponseError;
    }
  | {
      type:
        | typeof LOGIN_WITH_METAMASK_REQUESTED
        | typeof REGISTER_WITH_METAMASK_REQUESTED;
    }
  | {
      type:
        | typeof LOGIN_WITH_METAMASK_SUCCESS
        | typeof REGISTER_WITH_METAMASK_SUCCESS;
      payload: User;
    }
  | {
      type:
        | typeof LOGIN_WITH_METAMASK_FAILED
        | typeof REGISTER_WITH_METAMASK_FAILED;
      payload: ResponseError;
    };

export interface AuthDispatch {
  (dispatch: AuthActionParams | UtilActionParams): void;
}

export interface AuthAction {
  (dispatch: AuthDispatch): Promise<void | null>;
}

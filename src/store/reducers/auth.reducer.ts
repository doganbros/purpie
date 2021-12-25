import {
  USER_RETRIEVED_SUCCESS,
  USER_RETRIEVED_FAILED,
  LOGIN_REQUESTED,
  LOGIN_SUCCESS,
  FORGOT_PASSWORD_FAILED,
  FORGOT_PASSWORD_SUCCESS,
  REGISTER_REQUESTED,
  REGISTER_SUCCESS,
  REGISTER_FAILED,
  RESET_PASSWORD_REQUESTED,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILED,
  LOGOUT,
  FORGOT_PASSWORD_REQUESTED,
  THIRD_PARTY_URL_REQUESTED,
  LOGIN_FAILED,
  THIRD_PARTY_AUTH_WITH_CODE_SUCCESS,
  VERIFY_USER_EMAIL_FAILED,
  VERIFY_USER_EMAIL_SUCCESS,
  RESEND_MAIL_VERIFICATION_TOKEN_REQUESTED,
  RESEND_MAIL_VERIFICATION_TOKEN_SUCCESS,
  RESEND_MAIL_VERIFICATION_TOKEN_FAILED,
  MUST_SET_INITIAL_USER,
} from '../constants/auth.constants';
import { AuthState, AuthActionParams } from '../types/auth.types';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isInitialUserSetup: false,
  login: {
    loading: false,
    error: null,
  },
  register: {
    loading: false,
    error: null,
  },
  retrieveUser: {
    loading: true,
    error: null,
  },
  verifyUserEmail: {
    loading: false,
    error: null,
  },
  resendMailVerificationToken: {
    loading: false,
    error: null,
  },
  forgotPassword: {
    loading: false,
    error: null,
  },
  resetPassword: {
    loading: false,
    error: null,
  },
  loginWithFacebook: {
    buttonLoading: false,
    authenticating: false,
    error: null,
  },
  loginWithGoogle: {
    buttonLoading: false,
    authenticating: false,
    error: null,
  },
};

const authReducer = (
  state = initialState,
  action: AuthActionParams
): AuthState => {
  switch (action.type) {
    case THIRD_PARTY_URL_REQUESTED:
      if (action.payload === 'google')
        return {
          ...state,
          loginWithGoogle: {
            ...state.loginWithGoogle,
            buttonLoading: true,
          },
        };
      if (action.payload === 'facebook')
        return {
          ...state,
          loginWithFacebook: {
            ...state.loginWithFacebook,
            buttonLoading: true,
          },
        };
      return state;

    case THIRD_PARTY_AUTH_WITH_CODE_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };

    case LOGIN_REQUESTED:
      return {
        ...state,
        login: {
          ...state.login,
          loading: true,
        },
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        login: {
          error: null,
          loading: false,
        },
      };
    case LOGIN_FAILED:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        login: {
          error: action.payload,
          loading: false,
        },
      };

    case MUST_SET_INITIAL_USER:
      return {
        ...state,
        isInitialUserSetup: true,
        retrieveUser: {
          error: null,
          loading: false,
        },
      };
    case USER_RETRIEVED_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        retrieveUser: {
          error: null,
          loading: false,
        },
      };
    case USER_RETRIEVED_FAILED:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        retrieveUser: {
          error: action.payload,
          loading: false,
        },
      };
    case VERIFY_USER_EMAIL_SUCCESS:
      return {
        ...state,
        verifyUserEmail: {
          error: null,
          loading: false,
        },
      };
    case VERIFY_USER_EMAIL_FAILED:
      return {
        ...state,
        verifyUserEmail: {
          error: action.payload,
          loading: false,
        },
      };
    case FORGOT_PASSWORD_REQUESTED:
      return {
        ...state,
        forgotPassword: {
          ...state.login,
          loading: true,
        },
      };
    case FORGOT_PASSWORD_FAILED:
      return {
        ...state,
        forgotPassword: {
          ...state.forgotPassword,
          loading: false,
        },
      };
    case FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        forgotPassword: {
          error: null,
          loading: false,
        },
      };
    case RESEND_MAIL_VERIFICATION_TOKEN_REQUESTED:
      return {
        ...state,
        resendMailVerificationToken: {
          ...state.resendMailVerificationToken,
          loading: true,
        },
      };
    case RESEND_MAIL_VERIFICATION_TOKEN_SUCCESS:
      return {
        ...state,
        resendMailVerificationToken: {
          ...state.resendMailVerificationToken,
          loading: false,
        },
      };
    case RESEND_MAIL_VERIFICATION_TOKEN_FAILED:
      return {
        ...state,
        resendMailVerificationToken: {
          error: null,
          loading: false,
        },
      };
    case REGISTER_REQUESTED:
      return {
        ...state,
        register: {
          ...state.login,
          loading: true,
        },
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        register: {
          error: null,
          loading: false,
        },
      };
    case REGISTER_FAILED:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        register: {
          error: action.payload,
          loading: false,
        },
      };
    case RESET_PASSWORD_REQUESTED:
      return {
        ...state,
        resetPassword: {
          ...state.forgotPassword,
          loading: true,
        },
      };
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        resetPassword: {
          error: null,
          loading: false,
        },
      };
    case RESET_PASSWORD_FAILED:
      return {
        ...state,
        resetPassword: {
          error: action.payload,
          loading: false,
        },
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

export default authReducer;

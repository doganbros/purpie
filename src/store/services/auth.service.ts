import { http } from '../../config/http';
import {
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  User,
  VerifyEmailPayload,
} from '../types/auth.types';

export const login = async (user: LoginPayload): Promise<User> =>
  http.post('/auth/login', user).then((res) => res.data);

export const retrieveUser = async (): Promise<User> =>
  http
    .post(
      '/auth/retrieve',
      {},
      {
        showErrorToast: (err) =>
          err?.response?.data?.error !== 'INITIAL_USER_REQUIRED',
      }
    )
    .then((res) => res.data);

export const logOut = (): Promise<any> =>
  http.post('/auth/logout').then((res) => res.data);

export const register = async (user: RegisterPayload): Promise<User> =>
  http.post('/auth/register', user).then((res) => res.data);

export const resetPassword = async ({
  password,
  token,
}: ResetPasswordPayload): Promise<any> =>
  http.put('/auth/reset-password', { password, token });

export const verifyUserEmail = async ({
  token,
  userName,
}: VerifyEmailPayload): Promise<any> => {
  return http
    .post('/auth/verify-email', { token, userName })
    .then((res) => res.data);
};

export const resendMailVerificationToken = async (
  userId: number
): Promise<any> => {
  return http
    .post(`/auth/resend-mail-verification-token/${userId}`)
    .then((res) => res.data);
};

export const resetPasswordRequest = (email: string): Promise<any> =>
  http.post('/auth/reset-password-request', {
    email,
  });

export const userNameExistsCheck = (
  userName: string
): Promise<{ exists: boolean; userName: string }> =>
  http
    .post('/user/user-name-check', {
      userName,
    })
    .then((res) => res.data);

export const authenticateWithThirdPartyCode = async (
  name: string,
  code: string
): Promise<User> =>
  http.post(`/auth/third-party/${name}`, { code }).then((res) => res.data);

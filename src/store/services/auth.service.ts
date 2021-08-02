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
  http.post('/auth/retrieve').then((res) => res.data);

export const logOut = (): void => localStorage.removeItem('accessToken'); // TODO: implement logout

export const register = async (user: RegisterPayload): Promise<User> =>
  http.post('/auth/register', user).then((res) => res.data);

export const resetPassword = async ({
  password,
  token,
}: ResetPasswordPayload): Promise<any> =>
  http.put('/auth/reset-password', { password, token });

export const verifyUserEmail = async ({
  token,
}: VerifyEmailPayload): Promise<any> => {
  return http.post('/auth/verify-email', { token }).then((res) => res.data);
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

export const authenticateWithThirdPartyCode = async (
  name: string,
  code: string
): Promise<User> =>
  http.post(`/auth/third-party/${name}`, { code }).then((res) => res.data);

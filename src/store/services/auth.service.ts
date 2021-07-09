import { http } from '../../config/http';
import {
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  User,
  VerifyEmailPayload,
} from '../types/auth.types';

export const login = async (user: LoginPayload): Promise<User> => {
  const { token, user: resultUser } = await http
    .post('/auth/login', user)
    .then((res) => res.data);

  localStorage.setItem('accessToken', token);

  return resultUser;
};

export const retrieveUser = async (): Promise<User> => {
  const { user } = await http.post('/auth/retrieve').then((res) => res.data);

  return user;
};

export const logOut = (): void => localStorage.removeItem('accessToken');

export const register = async (user: RegisterPayload): Promise<User> => {
  const resultUser = await http
    .post('/auth/register', user)
    .then((res) => res.data);

  return resultUser;
};

export const resetPassword = async ({
  password,
  token,
}: ResetPasswordPayload): Promise<any> => {
  return http.put('/auth/reset-password', { password, token });
};

export const verifyUserEmail = async ({
  token,
}: VerifyEmailPayload): Promise<any> => {
  return http.post('/auth/verify-email', { token });
};

export const resetPasswordRequest = (email: string): Promise<any> =>
  http.post('/auth/reset-password-request', {
    email,
  });

export const authenticateWithThirdPartyCode = async (
  name: string,
  code: string
): Promise<User> => {
  const {
    token,
    user: resultUser,
  } = await http
    .post(`/auth/third-party/${name}`, { code })
    .then((res) => res.data);
  localStorage.setItem('accessToken', token);

  return resultUser;
};

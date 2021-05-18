import { http } from '../../config/http';
import {
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  User,
} from '../types/auth.types';

export const login = async (user: LoginPayload): Promise<User> => {
  const { accessToken, user: resultUser } = await http
    .post('/auth/login', user)
    .then((res) => res.data);

  localStorage.setItem('accessToken', accessToken);

  return resultUser;
};

export const retrieveUser = async (): Promise<User> => {
  const { user } = await http.post('/auth/retrieve').then((res) => res.data);

  return user;
};

export const logOut = (): void => localStorage.removeItem('accessToken');

export const register = async (user: RegisterPayload): Promise<User> => {
  const { accessToken, user: resultUser } = await http
    .post('/auth/register', user)
    .then((res) => res.data);

  localStorage.setItem('accessToken', accessToken);

  return resultUser;
};

export const resetPassword = async ({
  password,
  token,
}: ResetPasswordPayload): Promise<any> => {
  return http.put(
    '/auth/reset-password',
    { password },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const forgetPassword = (email: string): Promise<any> =>
  http.post('/auth/reset-password', {
    email,
  });

export const getThirdPartyUrl = (name: string): Promise<string> =>
  http.get(`/auth/third-party/${name}`).then((res) => res.data?.url);

export const authenticateWithThirdPartyCode = async (
  name: string,
  code: string
): Promise<User> => {
  const {
    accessToken,
    user: resultUser,
  } = await http
    .post(`/auth/third-party/${name}`, { code })
    .then((res) => res.data);
  localStorage.setItem('accessToken', accessToken);

  return resultUser;
};

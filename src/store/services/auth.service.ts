import { serialize } from 'object-to-formdata';
import { http } from '../../config/http';
import {
  ExistenceResult,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  User,
  VerifyEmailPayload,
  UpdateProfileInfoPayload,
  UpdatePasswordPayload,
  CompleteProfilePayload,
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
          err?.response?.data?.message !== 'INITIAL_USER_REQUIRED',
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

export const completeProfile = async ({
  token,
  userName,
}: CompleteProfilePayload): Promise<any> => {
  return http
    .post('/auth/third-party/profile/complete', { token, userName })
    .then((res) => res.data);
};

export const resendMailVerificationToken = async (
  userId: string
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
): Promise<ExistenceResult> =>
  http
    .post('/user/user-name-check', {
      userName,
    })
    .then((res) => res.data);

export const authenticateWithThirdPartyCode = async (
  name: string,
  code: string | null,
  email: string | null
): Promise<User | string> =>
  http
    .post(`/auth/third-party/${name}`, code ? { code } : { email })
    .then((res) => res.data);

export const initializeUser = (user: RegisterPayload): Promise<User> =>
  http.post('auth/initial-user', user).then((res) => res.data);

export const updateProfileInfo = (
  user: UpdateProfileInfoPayload
): Promise<User> => http.put('user/profile', user).then((res) => res.data);

export const updateProfilePhoto = (photoFile: File): Promise<any> =>
  http.put(`user/display-photo/`, serialize(photoFile)).then((res) => res.data);

export const updatePassword = (password: UpdatePasswordPayload): Promise<any> =>
  http.put('auth/change-password', password).then((res) => res.data);

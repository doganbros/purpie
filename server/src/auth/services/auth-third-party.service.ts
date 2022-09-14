import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { User } from 'entities/User.entity';
import { Repository } from 'typeorm';
import { UserBasic } from '../interfaces/user.interface';

const {
  GOOGLE_OAUTH_CLIENT_SECRET = '',
  GOOGLE_OAUTH_CLIENT_ID = '',
  FACEBOOK_OAUTH_CLIENT_ID = '',
  FACEBOOK_OAUTH_CLIENT_SECRET = '',
  REACT_APP_CLIENT_HOST = '',
} = process.env;

@Injectable()
export class AuthThirdPartyService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  getGoogleAuthAccessToken(code: string): Promise<string> {
    return axios({
      url: `https://oauth2.googleapis.com/token`,
      method: 'post',
      data: {
        client_id: GOOGLE_OAUTH_CLIENT_ID,
        client_secret: GOOGLE_OAUTH_CLIENT_SECRET,
        redirect_uri: `${REACT_APP_CLIENT_HOST}/auth/google`,
        grant_type: 'authorization_code',
        code,
      },
    }).then((res) => res.data.access_token);
  }

  getGoogleUserInfo(accessToken: string): Promise<Record<string, any>> {
    return axios({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      method: 'get',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.data);
  }

  getFacebookAuthAccessToken(code: string): Promise<string> {
    return axios({
      url: `https://graph.facebook.com/v4.0/oauth/access_token`,
      method: 'get',
      params: {
        client_id: FACEBOOK_OAUTH_CLIENT_ID,
        client_secret: FACEBOOK_OAUTH_CLIENT_SECRET,
        redirect_uri: `${REACT_APP_CLIENT_HOST}/auth/facebook`,
        code,
      },
    }).then((res) => res.data);
  }

  getFacebookUserInfo(accessToken: string): Promise<Record<string, any>> {
    return axios({
      url: 'https://graph.facebook.com/me',
      method: 'get',
      params: {
        fields: ['id', 'email', 'first_name', 'last_name', 'middle_name'].join(
          ',',
        ),
        accessToken,
      },
    }).then((res) => res.data);
  }

  async registerUserByThirdParty({
    fullName,
    email,
    googleId,
    facebookId,
  }: UserBasic) {
    return this.userRepository
      .create({
        fullName,
        email,
        googleId,
        facebookId,
        userRoleCode: 'NORMAL',
        emailConfirmed: true,
      })
      .save();
  }
}

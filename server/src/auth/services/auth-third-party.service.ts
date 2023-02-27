import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { User } from 'entities/User.entity';
import { Repository } from 'typeorm';
import { UserBasic } from '../interfaces/user.interface';
import { AuthService } from './auth.service';

const {
  GOOGLE_OAUTH_CLIENT_SECRET = '',
  GOOGLE_OAUTH_CLIENT_ID = '',
  REACT_APP_CLIENT_HOST = '',
} = process.env;

@Injectable()
export class AuthThirdPartyService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private authService: AuthService,
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

  async registerUserByThirdParty({ fullName, email, googleId }: UserBasic) {
    const user = this.userRepository.create({
      fullName,
      email,
      googleId,
      userRoleCode: 'NORMAL',
    });

    return this.authService.setMailVerificationToken(user);
  }
}

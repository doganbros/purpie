import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { Invitation } from 'entities/Invitation.entity';
import { User } from 'entities/User.entity';
import { UserZone } from 'entities/UserZone.entity';
import { Zone } from 'entities/Zone.entity';
import { generateJWT } from 'helpers/jwt';
import { MailService } from 'src/mail/mail.service';
import { Not, Repository, IsNull } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserBasic, UserBasicWithToken } from './interfaces/user.interface';

const {
  AUTH_TOKEN_SECRET = 'secret_a',
  GOOGLE_OAUTH_CLIENT_SECRET = '',
  GOOGLE_OAUTH_CLIENT_ID = '',
  FACEBOOK_OAUTH_CLIENT_ID = '',
  FACEBOOK_OAUTH_CLIENT_SECRET = '',
  AUTH_TOKEN_LIFE = '24h',
  RESET_PASSWORD_TOKEN_SECRET = 'secret_r',
  REACT_APP_CLIENT_HOST = 'http://localhost:3000',
  MAIL_VERIFICATION_TOKEN_SECRET = 'secret_m',
} = process.env;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private mailService: MailService,
  ) {}

  async generateLoginToken(payload: Record<string, any>) {
    const token = await generateJWT(payload, AUTH_TOKEN_SECRET, {
      expiresIn: AUTH_TOKEN_LIFE,
    });

    return token;
  }

  async generateResetPasswordToken(email: string) {
    const token = await generateJWT({ email }, RESET_PASSWORD_TOKEN_SECRET, {
      expiresIn: '1h',
    });

    return token;
  }

  async registerUser({
    firstName,
    lastName,
    email,
    password: unhashedPassword,
  }: RegisterUserDto): Promise<UserBasicWithToken> {
    const password = await bcrypt.hash(unhashedPassword, 10);

    let user = this.userRepository.create({
      firstName,
      lastName,
      email,
      password,
      userRoleCode: 'NORMAL',
    });

    const registeredUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    const token = await generateJWT(
      registeredUser,
      MAIL_VERIFICATION_TOKEN_SECRET,
      {
        expiresIn: '1h',
      },
    );

    user.mailVerificationToken = await bcrypt.hash(token, 10);

    user = await user.save();

    return {
      user: registeredUser,
      token,
    };
  }

  async registerUserByThirdParty({
    firstName,
    lastName,
    email,
    googleId,
    facebookId,
  }: UserBasic) {
    let user = this.userRepository.create({
      firstName,
      lastName,
      email,
      googleId,
      facebookId,
      userRoleCode: 'NORMAL',
      emailConfirmed: true,
    });

    user = await user.save();

    return user;
  }

  async subdomainValidity(subdomain: string, email: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin(Invitation, 'invitation', 'invitation.email = user.email')
      .leftJoin(UserZone, 'user_zone', 'user_zone.userId = user.id')
      .innerJoin(
        Zone,
        'zone',
        'zone.id = invitation.zoneId or zone.id = user_zone.zoneId',
      )
      .where('user.email = :email', { email })
      .andWhere('zone.subdomain = :subdomain', { subdomain })
      .getOne();

    if (!user)
      throw new NotFoundException(
        `Couldn't find zone with this subdomain`,
        'UNAUTHORIZED_SUBDOMAIN',
      );
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
      relations: ['userRole'],
    });

    return user;
  }

  async getUserByEmailAndResetPasswordToken(email: string, token: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
        forgotPasswordToken: Not(IsNull()),
      },
    });

    if (!user)
      throw new NotFoundException(
        `Invalid Token or user doesn't exist`,
        'INVALID_TOKEN_OR_USER_NOT_EXIST',
      );

    const isValid = await bcrypt.compare(token, user.forgotPasswordToken);

    if (!isValid)
      throw new NotFoundException(
        `Invalid Token or user doesn't exist`,
        'INVALID_TOKEN_OR_USER_NOT_EXIST',
      );

    return user;
  }

  async verifyUserEmail(email: string, token: string): Promise<UserBasic> {
    const user = await this.userRepository.findOne({
      where: {
        email,
        emailConfirmed: false,
        mailVerificationToken: Not(IsNull()),
      },
    });

    if (!user) throw new NotFoundException('User not found', 'USER_NOT_FOUND');

    const isValid = await bcrypt.compare(token, user.mailVerificationToken);

    if (!isValid)
      throw new NotFoundException(
        `Invalid Token or user doesn't exist`,
        'INVALID_TOKEN_OR_USER_NOT_EXIST',
      );

    user.emailConfirmed = true;
    user.mailVerificationToken = null!;
    await user.save();
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  }

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

  async sendAccountVerificationMail({
    user: { firstName, lastName, email },
    token,
  }: UserBasicWithToken) {
    const context = {
      firstName,
      lastName,
      link: `${REACT_APP_CLIENT_HOST}/verify-email/${token}`,
    };
    return this.mailService.sendMailByView(
      email,
      'Verify Octopus Account',
      'account-verification',
      context,
    );
  }

  async sendResetPasswordMail({
    user: { firstName, lastName, email },
    token,
  }: UserBasicWithToken) {
    const context = {
      firstName,
      lastName,
      link: `${REACT_APP_CLIENT_HOST}/reset-password/${token}`,
    };
    return this.mailService.sendMailByView(
      email,
      'Reset Password',
      'reset-password',
      context,
    );
  }
}

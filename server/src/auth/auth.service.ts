import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import dayjs from 'dayjs';
import { Client } from 'entities/Client.entity';
import { User } from 'entities/User.entity';
import { UserRefreshToken } from 'entities/UserRefreshToken.entity';
import { UserZone } from 'entities/UserZone.entity';
import { Zone } from 'entities/Zone.entity';
import { Response } from 'express';
import { generateJWT, verifyJWT } from 'helpers/jwt';
import { alphaNum, compareHash, hash } from 'helpers/utils';
import { customAlphabet, nanoid } from 'nanoid';
import { MailService } from 'src/mail/mail.service';
import { UtilsService } from 'src/utils/utils.service';
import { Not, Repository, IsNull } from 'typeorm';
import {
  MAIL_VERIFICATION_TYPE,
  PASSWORD_VERIFICATION_TYPE,
} from './constants/auth.constants';
import { CreateClientDto } from './dto/create-client.dto';
import { LoginClientDto } from './dto/login-client.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import {
  UserBasic,
  UserBasicWithToken,
  UserPayload,
} from './interfaces/user.interface';

const {
  AUTH_TOKEN_SECRET = '',
  AUTH_TOKEN_SECRET_REFRESH = '',
  GOOGLE_OAUTH_CLIENT_SECRET = '',
  GOOGLE_OAUTH_CLIENT_ID = '',
  FACEBOOK_OAUTH_CLIENT_ID = '',
  FACEBOOK_OAUTH_CLIENT_SECRET = '',
  AUTH_TOKEN_LIFE = '1h',
  AUTH_TOKEN_REFRESH_LIFE = '30d',
  REACT_APP_CLIENT_HOST = '',
  REACT_APP_SERVER_HOST = '',
  VERIFICATION_TOKEN_SECRET = '',
} = process.env;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Client) private clientRepository: Repository<Client>,
    @InjectRepository(UserRefreshToken)
    private userRefreshTokenRepository: Repository<UserRefreshToken>,
    private mailService: MailService,
    private utilService: UtilsService,
  ) {}

  async generateLoginToken(
    payload: Record<string, any>,
    authSecret?: string,
    refreshAuthSecret?: string,
  ) {
    const refreshTokenId = nanoid();
    const jwtPayload = { ...payload, refreshTokenId };
    const accessToken = await generateJWT(
      jwtPayload,
      authSecret || AUTH_TOKEN_SECRET,
      {
        expiresIn: AUTH_TOKEN_LIFE,
      },
    );

    const refreshToken = await generateJWT(
      jwtPayload,
      refreshAuthSecret || AUTH_TOKEN_SECRET_REFRESH,
      {
        expiresIn: AUTH_TOKEN_REFRESH_LIFE,
      },
    );

    return {
      accessToken,
      refreshToken,
      refreshTokenId,
    };
  }

  async generateResetPasswordToken(email: string) {
    return generateJWT(
      { email, verificationType: PASSWORD_VERIFICATION_TYPE },
      VERIFICATION_TOKEN_SECRET,
      {
        expiresIn: '1h',
      },
    );
  }

  async setAccessTokens(userPayload: UserPayload, res: Response) {
    await this.userRefreshTokenRepository.delete({
      userId: userPayload.id,
      id: userPayload.refreshTokenId,
    });

    const {
      accessToken,
      refreshToken,
      refreshTokenId,
    } = await this.generateLoginToken(userPayload);

    await this.userRefreshTokenRepository
      .create({
        id: refreshTokenId,
        userId: userPayload.id,
        token: await hash(refreshToken),
      })
      .save();

    res.cookie('OCTOPUS_ACCESS_TOKEN', accessToken, {
      expires: dayjs().add(30, 'days').toDate(),
      domain: `.${new URL(REACT_APP_SERVER_HOST).hostname}`,
      httpOnly: true,
    });
    res.cookie('OCTOPUS_REFRESH_ACCESS_TOKEN', refreshToken, {
      expires: dayjs().add(30, 'days').toDate(),
      domain: `.${new URL(REACT_APP_SERVER_HOST).hostname}`,
      httpOnly: true,
    });
    return refreshTokenId;
  }

  removeAccessTokens(res: Response) {
    res.cookie('OCTOPUS_ACCESS_TOKEN', '', {
      expires: new Date(),
      domain: `.${new URL(REACT_APP_SERVER_HOST).hostname}`,
      httpOnly: true,
    });
    res.cookie('OCTOPUS_REFRESH_ACCESS_TOKEN', '', {
      expires: new Date(),
      domain: `.${new URL(REACT_APP_SERVER_HOST).hostname}`,
      httpOnly: true,
    });
  }

  async verifyRefreshToken(userPayload: UserPayload, refreshToken: string) {
    const userRefreshToken = await this.userRefreshTokenRepository.findOne({
      where: {
        id: userPayload.refreshTokenId,
      },
      relations: ['user', 'user.userRole'],
    });

    if (!userRefreshToken)
      throw new NotFoundException('User not found', 'USER_NOT_FOUND');

    const isValid = await compareHash(refreshToken, userRefreshToken.token);
    if (!isValid)
      throw new UnauthorizedException(
        'You not authorized to use this route',
        'NOT_SIGNED_IN',
      );

    return userRefreshToken.user;
  }

  async removeRefreshToken(userId: number, refreshTokenId: string) {
    return this.userRefreshTokenRepository.delete({
      userId,
      id: refreshTokenId,
    });
  }

  async registerUser({
    firstName,
    lastName,
    email,
    password: unhashedPassword,
  }: RegisterUserDto): Promise<UserBasicWithToken> {
    const password = await bcrypt.hash(unhashedPassword, 10);

    const user = this.userRepository.create({
      firstName,
      lastName,
      email,
      password,
      userRoleCode: 'NORMAL',
    });

    return this.setMailVerificationToken(user);
  }

  async createClient(userId: number, createClientInfo: CreateClientDto) {
    const apiKey = customAlphabet(alphaNum, 50)();
    const apiSecret = customAlphabet(alphaNum, 70)();

    const apiSecretHashed = await bcrypt.hash(apiSecret, 10);

    await this.clientRepository
      .create({
        apiKey,
        apiSecret: apiSecretHashed,
        name: createClientInfo.name,
        clientRoleCode: createClientInfo.roleCode,
        createdById: userId,
      })
      .save();
    return {
      apiKey,
      apiSecret,
    };
  }

  async authenticateClient(info: LoginClientDto) {
    const client = await this.clientRepository.findOne({
      where: { apiKey: info.apiKey },
      relations: ['clientRole'],
    });

    if (!client)
      throw new NotFoundException(
        'Wrong client apiKey or apiSecret',
        'WRONG_CLIENT_API_KEY_OR_SECRET',
      );

    const isValid = await bcrypt.compare(info.apiSecret, client.apiSecret);

    if (!isValid)
      throw new NotFoundException(
        'Wrong client apiKey or apiSecret',
        'WRONG_CLIENT_API_KEY_OR_SECRET',
      );

    const tokens = await this.generateLoginToken({
      id: client.id,
      name: client.name,
      clientRole: client.clientRole,
    });

    client.refreshToken = await hash(tokens.refreshToken);
    await client.save();

    return tokens;
  }

  async refreshClientTokens(refreshToken: string) {
    try {
      const payload = await verifyJWT(refreshToken, AUTH_TOKEN_SECRET_REFRESH);

      const client = await this.clientRepository.findOneOrFail({
        where: { id: payload.id, refreshToken: Not(IsNull()) },
        relations: ['clientRole'],
      });

      const isValid = await compareHash(refreshToken, client.refreshToken!);

      if (!isValid) throw new Error('Not Valid');

      const tokens = await this.generateLoginToken({
        id: client.id,
        name: client.name,
        clientRole: client.clientRole,
      });
      client.refreshToken = await hash(tokens.refreshToken);
      await client.save();
      return tokens;
    } catch (err) {
      throw new UnauthorizedException(
        'Invalid Refresh Token',
        'INVALID_REFRESH_TOKEN',
      );
    }
  }

  async removeClientRefreshToken(id: number) {
    await this.clientRepository.update(id, { refreshToken: null });
  }

  async setMailVerificationToken(user: User) {
    const userInfo = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      verificationType: MAIL_VERIFICATION_TYPE,
    };
    const token = await generateJWT(userInfo, VERIFICATION_TOKEN_SECRET, {
      expiresIn: '1h',
    });

    user.mailVerificationToken = await hash(token);

    await user.save();
    return {
      user: userInfo,
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
      .leftJoin(UserZone, 'user_zone', 'user_zone.userId = user.id')
      .innerJoin(Zone, 'zone', 'zone.id = user_zone.zoneId')
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

  getUserByEmail(email: string) {
    return this.userRepository.findOne({
      where: {
        email,
      },
      relations: ['userRole'],
    });
  }

  getUserByEmailOrUserName(value: string) {
    return this.userRepository.findOne({
      where: [
        {
          email: value,
        },
        { userName: value },
      ],
      relations: ['userRole'],
    });
  }

  async verifyResendMailVerificationToken(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        emailConfirmed: false,
      },
    });

    if (!user) throw new NotFoundException('User not found', 'USER_NOT_FOUND');

    return this.setMailVerificationToken(user);
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
        `Invalid password reset token`,
        'INVALID_PASSWORD_RESET_TOKEN',
      );

    const isValid = await compareHash(token, user.forgotPasswordToken);

    if (!isValid)
      throw new NotFoundException(
        `Invalid password reset token`,
        'INVALID_PASSWORD_RESET_TOKEN',
      );

    return user;
  }

  async verifyUserEmail(
    email: string,
    userName: string,
    token: string,
  ): Promise<UserBasic> {
    const user = await this.userRepository.findOne({
      where: {
        email,
        emailConfirmed: false,
        mailVerificationToken: Not(IsNull()),
      },
    });

    if (!user) throw new NotFoundException('User not found', 'USER_NOT_FOUND');

    const isValid = await compareHash(token, user.mailVerificationToken);

    if (!isValid)
      throw new NotFoundException('User not found', 'USER_NOT_FOUND');

    user.emailConfirmed = true;
    user.mailVerificationToken = null!;
    user.userName = userName;
    await user.save();

    await this.createMattermostUserAndJoinDefaults(user);

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

  async createMattermostPersonalTokenForUser(mattermostId: string) {
    await this.utilService.mattermostClient.revokeAllSessionsForUser(
      mattermostId,
    );
    const {
      token,
    } = await this.utilService.mattermostClient.createUserAccessToken(
      mattermostId,
      'Mattermost personal token for user created in octopus',
    );
    return token;
  }

  async createMattermostUserAndJoinDefaults(user: UserPayload) {
    const profile = await this.utilService.mattermostClient.createUser(
      {
        email: user.email,
        username: user.userName,
        first_name: user.firstName,
        last_name: user.lastName,
        auth_service: 'google',
      } as any,
      '',
      '',
      '',
    );
    await this.userRepository.update(
      { id: user.id },
      { mattermostId: profile.id },
    );

    await this.utilService.mattermostClient.addUsersToTeam(
      this.utilService.octopusAppTeam!.id,
      [profile.id],
    );

    await this.utilService.mattermostClient.addToChannel(
      profile.id,
      this.utilService.octopusBroadcastChannel!.id,
    );

    return profile;
  }
}

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcryptjs';
import dayjs from 'dayjs';
import { User } from 'entities/User.entity';
import { UserRefreshToken } from 'entities/UserRefreshToken.entity';
import { UserRole } from 'entities/UserRole.entity';
import { UserZone } from 'entities/UserZone.entity';
import { Zone } from 'entities/Zone.entity';
import { Request, Response } from 'express';
import { generateJWT, getJWTCookieKeys } from 'helpers/jwt';
import { alphaNum, compareHash, detectBrowser, hash } from 'helpers/utils';
import { customAlphabet, nanoid } from 'nanoid';
import { MailService } from 'src/mail/mail.service';
import { Brackets, IsNull, Not, Repository } from 'typeorm';
import { isUUID } from '@nestjs/common/utils/is-uuid';
import {
  MAIL_VERIFICATION_TYPE,
  PASSWORD_VERIFICATION_TYPE,
} from '../constants/auth.constants';
import { InitializeUserDto } from '../dto/initialize-user.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import {
  UserApiCredentials,
  UserBasicWithToken,
  UserProfile,
  UserTokenPayload,
} from '../interfaces/user.interface';
import { ErrorTypes } from '../../../types/ErrorTypes';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { BrowserType } from '../../../types/BrowserType';
import { PostFolder } from '../../../entities/PostFolder.entity';
import { FolderService } from '../../post/services/folder.service';
import { MembershipService } from '../../membership/services/membership.service';

const {
  AUTH_TOKEN_SECRET = '',
  AUTH_TOKEN_SECRET_REFRESH = '',
  AUTH_TOKEN_LIFE = '1h',
  AUTH_TOKEN_REFRESH_LIFE = '30d',
  REACT_APP_CLIENT_HOST = '',
  REACT_APP_SERVER_HOST = '',
  NODE_ENV = '',
  VERIFICATION_TOKEN_SECRET = '',
} = process.env;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(PostFolder)
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @InjectRepository(UserRefreshToken)
    private userRefreshTokenRepository: Repository<UserRefreshToken>,
    private mailService: MailService,
    private postFolderService: FolderService,
    private membershipService: MembershipService,
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

  async setAccessTokens(
    userPayload: UserTokenPayload,
    res: Response,
    req: Request,
  ) {
    if (userPayload.refreshTokenId) {
      await this.userRefreshTokenRepository.delete({
        userId: userPayload.id,
        id: userPayload.refreshTokenId,
      });
    }

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

    const domain = `.${new URL(REACT_APP_SERVER_HOST).hostname}`;
    const isDevelopment = NODE_ENV === 'development';

    const userAgent = req.headers['user-agent'];
    const isSafariBrowser = detectBrowser(userAgent!) === BrowserType.SAFARI;

    const { accessTokenKey, refreshAccessTokenKey } = getJWTCookieKeys();
    res.cookie(accessTokenKey, accessToken, {
      expires: dayjs().add(30, 'days').toDate(),
      domain: REACT_APP_SERVER_HOST.includes('localhost') ? undefined : domain,
      httpOnly: true,
      secure: !(isDevelopment && isSafariBrowser),
      sameSite: isDevelopment ? 'none' : 'lax',
    });
    res.cookie(refreshAccessTokenKey, refreshToken, {
      expires: dayjs().add(30, 'days').toDate(),
      domain: REACT_APP_SERVER_HOST.includes('localhost') ? undefined : domain,
      httpOnly: true,
      secure: !(isDevelopment && isSafariBrowser),
      sameSite: isDevelopment ? 'none' : 'lax',
    });

    return refreshTokenId;
  }

  removeAccessTokens(req: Request, res: Response) {
    const domain = `.${new URL(REACT_APP_SERVER_HOST).hostname}`;
    const isDevelopment = NODE_ENV === 'development';

    const userAgent = req.headers['user-agent'];
    const isSafariBrowser = detectBrowser(userAgent!) === BrowserType.SAFARI;

    const { accessTokenKey, refreshAccessTokenKey } = getJWTCookieKeys();
    res.clearCookie(accessTokenKey, {
      expires: dayjs().add(30, 'days').toDate(),
      domain: REACT_APP_SERVER_HOST.includes('localhost') ? undefined : domain,
      httpOnly: true,
      secure: !(isDevelopment && isSafariBrowser),
      sameSite: isDevelopment ? 'none' : 'lax',
    });
    res.clearCookie(refreshAccessTokenKey, {
      expires: dayjs().add(30, 'days').toDate(),
      domain: REACT_APP_SERVER_HOST.includes('localhost') ? undefined : domain,
      httpOnly: true,
      secure: !(isDevelopment && isSafariBrowser),
      sameSite: isDevelopment ? 'none' : 'lax',
    });
  }

  async verifyRefreshToken(refreshTokenId: string, refreshToken: string) {
    const userRefreshToken = await this.userRefreshTokenRepository.findOne({
      where: {
        id: refreshTokenId,
      },
    });

    if (!userRefreshToken)
      throw new UnauthorizedException(
        ErrorTypes.NOT_SIGNED_IN,
        'You not authorized to use this route',
      );

    const isValid = await compareHash(refreshToken, userRefreshToken.token);
    if (!isValid)
      throw new UnauthorizedException(
        ErrorTypes.NOT_SIGNED_IN,
        'You not authorized to use this route',
      );

    return true;
  }

  async removeRefreshToken(userId: string, refreshTokenId: string) {
    const userRefreshToken = await this.userRefreshTokenRepository.findOne({
      where: { id: refreshTokenId, userId },
    });

    if (userRefreshToken) userRefreshToken.remove();
  }

  async systemUserCount() {
    return this.userRepository.count();
  }

  getUserProfile(userId: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.fullName',
        'user.userName',
        'user.displayPhoto',
        'user.email',
      ])
      .innerJoinAndSelect('user.userRole', 'userRole')
      .where('id = :userId', { userId })
      .getOneOrFail();
  }

  async registerUser({
    fullName,
    email,
    password: unhashedPassword,
  }: RegisterUserDto): Promise<UserBasicWithToken> {
    const password = await bcrypt.hash(unhashedPassword, 10);

    const user = await this.userRepository.create({
      fullName,
      email,
      password,
      userRoleCode: 'NORMAL',
    });

    this.membershipService.createUserMembership(user.id, user.email);
    return this.setMailVerificationToken(user);
  }

  async setMailVerificationToken(user: User) {
    const userInfo = {
      fullName: user.fullName,
      email: user.email,
      verificationType: MAIL_VERIFICATION_TYPE,
    };
    const token = await generateJWT(userInfo, VERIFICATION_TOKEN_SECRET, {
      expiresIn: '1h',
    });

    user.mailVerificationToken = await hash(token);

    let savedUser;
    try {
      savedUser = await user.save();
    } catch (error) {
      throw new BadRequestException(
        ErrorTypes.USER_ALREADY_REGISTERED,
        `The user with ${user.email} email already registered`,
      );
    }
    const userPostFolders = await this.postFolderService.getUserPostFolders(
      savedUser.id,
    );
    if (userPostFolders?.length === 0)
      await this.postFolderService.createFolder(savedUser.id, {
        title: 'Bookmarks',
        postId: null,
      });

    return {
      user,
      token,
    };
  }

  async subdomainValidity(subdomain: string, identifier: string) {
    const baseQuery = this.userRepository
      .createQueryBuilder('user')
      .innerJoin(Zone, 'zone', 'zone.subdomain = :subdomain', { subdomain })
      .leftJoin(
        UserZone,
        'user_zone',
        'user_zone.userId = user.id and user_zone.zoneId = zone.id',
      )
      .setParameter('identifier', identifier)
      .where(
        new Brackets((qb) => {
          qb.where('zone.public = true').orWhere('user_zone.id is not null');
        }),
      );

    if (isUUID(identifier)) baseQuery.andWhere('user.id = :identifier');
    else {
      baseQuery.andWhere(
        new Brackets((qb) => {
          qb.where('user.userName = :identifier').orWhere(
            'user.email = :identifier',
          );
        }),
      );
    }

    const user = await baseQuery.getOne();

    if (!user)
      throw new NotFoundException(
        ErrorTypes.UNAUTHORIZED_SUBDOMAIN,
        `Couldn't find zone with this subdomain`,
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

  getUserByApiKey(value: string) {
    return this.userRepository.findOne({
      where: {
        apiKey: value,
      },
      relations: ['userRole'],
    });
  }

  async verifyResendMailVerificationToken(userId: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        emailConfirmed: false,
      },
    });

    if (!user)
      throw new NotFoundException(ErrorTypes.USER_NOT_FOUND, 'User not found');

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
        ErrorTypes.INVALID_PASSWORD_RESET_TOKEN,
        `Invalid password reset token`,
      );

    const isValid = await compareHash(token, user.forgotPasswordToken);

    if (!isValid)
      throw new NotFoundException(
        ErrorTypes.INVALID_PASSWORD_RESET_TOKEN,
        `Invalid password reset token`,
      );

    return user;
  }

  async verifyUserEmail(
    email: string,
    userName: string,
    token: string,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        email,
        emailConfirmed: false,
        mailVerificationToken: Not(IsNull()),
      },
    });

    if (!user)
      throw new NotFoundException(ErrorTypes.USER_NOT_FOUND, 'User not found');

    const isValid = await compareHash(token, user.mailVerificationToken);

    if (!isValid)
      throw new UnauthorizedException(
        ErrorTypes.INVALID_JWT,
        'Email confirmation JWT is invalid',
      );

    user.emailConfirmed = true;
    user.mailVerificationToken = null!;
    user.userName = userName;
    await user.save();

    return user;
  }

  async initializeUser(info: InitializeUserDto, res: Response, req: Request) {
    const user = await this.userRepository
      .create({
        fullName: info.fullName,
        userName: info.userName,
        email: info.email,
        emailConfirmed: true,
        userRoleCode: 'SUPER_ADMIN',
        password: await bcrypt.hash(info.password, 10),
      })
      .save();
    try {
      const userRole = await this.userRoleRepository.findOne({
        where: {
          roleCode: 'SUPER_ADMIN',
        },
      });

      const userPayload: UserProfile = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        userName: user.userName,
        userRole: {
          ...userRole!,
        },
      };

      await this.setAccessTokens(
        {
          id: user.id,
        },
        res,
        req,
      );

      return userPayload;
    } catch (err: any) {
      await user.remove();
      throw err;
    }
  }

  async sendAccountVerificationMail({
    user: { fullName, email },
    token,
  }: UserBasicWithToken) {
    const context = {
      fullName,
      link: `${REACT_APP_CLIENT_HOST}/verify-email/${token}`,
    };
    return this.mailService.sendMailByView(
      email,
      'Verify Purpie Account',
      'account-verification',
      context,
    );
  }

  async sendResetPasswordMail({
    user: { fullName, email },
    token,
  }: UserBasicWithToken) {
    const context = {
      fullName,
      link: `${REACT_APP_CLIENT_HOST}/reset-password/${token}`,
    };
    return this.mailService.sendMailByView(
      email,
      'Reset Password',
      'reset-password',
      context,
    );
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<boolean> {
    if (changePasswordDto.newPassword !== changePasswordDto.confirmNewPassword)
      throw new BadRequestException(
        ErrorTypes.PASSWORDS_NOT_MATCH,
        'New password and confirm passwords needs to be same!',
      );

    const user: User = await this.userRepository.findOneOrFail({
      where: {
        id: userId,
      },
    });

    const validPassword = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );
    if (!validPassword)
      throw new ForbiddenException(
        ErrorTypes.CURRENT_PASSWORD_NOT_CORRECT,
        'User current password is invalid!',
      );

    user.password = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await user.save();

    return true;
  }

  async getUserMembership(userId: string) {
    return this.membershipService.getUserMembership(userId);
  }

  async getApiCredentials(userId: string) {
    const { apiKey } = await this.userRepository.findOneOrFail({
      id: userId,
    });

    if (apiKey) {
      return { apiKey };
    }

    return null;
  }

  async createApiCredentials(userId: string): Promise<UserApiCredentials> {
    const apiKey = customAlphabet(alphaNum, 50)();
    const apiSecret = customAlphabet(alphaNum, 70)();

    const apiSecretHashed = await bcrypt.hash(apiSecret, 10);

    await this.userRepository.update(
      { id: userId },
      { apiKey, apiSecret: apiSecretHashed },
    );

    return { apiKey, apiSecret };
  }
}

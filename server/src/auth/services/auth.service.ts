import {
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
import { Response } from 'express';
import { generateJWT } from 'helpers/jwt';
import { compareHash, fetchOrProduceNull, hash } from 'helpers/utils';
import { nanoid } from 'nanoid';
import { MailService } from 'src/mail/mail.service';
import { MattermostService } from 'src/utils/services/mattermost.service';
import { Not, Repository, IsNull, Brackets } from 'typeorm';
import {
  MAIL_VERIFICATION_TYPE,
  PASSWORD_VERIFICATION_TYPE,
} from '../constants/auth.constants';
import { InitializeUserDto } from '../dto/initialize-user.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import {
  UserBasic,
  UserBasicWithToken,
  UserProfile,
  UserTokenPayload,
} from '../interfaces/user.interface';

const {
  AUTH_TOKEN_SECRET = '',
  AUTH_TOKEN_SECRET_REFRESH = '',
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
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @InjectRepository(UserRefreshToken)
    private userRefreshTokenRepository: Repository<UserRefreshToken>,
    private mailService: MailService,
    private mattermostService: MattermostService,
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
    mattermostToken?: string,
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
        mattermostTokenId: userPayload.mattermostTokenId,
        token: await hash(refreshToken),
      })
      .save();

    res.cookie('OCTOPUS_ACCESS_TOKEN', accessToken, {
      expires: dayjs().add(30, 'days').toDate(),
      domain: `.${new URL(REACT_APP_SERVER_HOST).hostname}`,
      httpOnly: true,
      secure: true,
    });
    res.cookie('OCTOPUS_REFRESH_ACCESS_TOKEN', refreshToken, {
      expires: dayjs().add(30, 'days').toDate(),
      domain: `.${new URL(REACT_APP_SERVER_HOST).hostname}`,
      httpOnly: true,
      secure: true,
    });
    if (mattermostToken) {
      res.cookie('MM_ACCESS_TOKEN', mattermostToken, {
        secure: true,
        expires: dayjs().add(30, 'days').toDate(),
        httpOnly: false,
        domain: `.${new URL(REACT_APP_SERVER_HOST).hostname}`,
      });
    }
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

  async verifyRefreshToken(refreshTokenId: string, refreshToken: string) {
    const userRefreshToken = await this.userRefreshTokenRepository.findOne({
      where: {
        id: refreshTokenId,
      },
    });

    if (!userRefreshToken)
      throw new UnauthorizedException(
        'You not authorized to use this route',
        'NOT_SIGNED_IN',
      );

    const isValid = await compareHash(refreshToken, userRefreshToken.token);
    if (!isValid)
      throw new UnauthorizedException(
        'You not authorized to use this route',
        'NOT_SIGNED_IN',
      );

    return true;
  }

  async removeRefreshToken(userId: number, refreshTokenId: string) {
    const userRefreshToken = await this.userRefreshTokenRepository.findOne({
      where: { id: refreshTokenId, userId },
    });

    if (userRefreshToken) {
      if (userRefreshToken.mattermostTokenId) {
        fetchOrProduceNull(() =>
          this.mattermostService.mattermostClient.revokeUserAccessToken(
            userRefreshToken.mattermostTokenId!,
          ),
        );
      }
      userRefreshToken.remove();
    }
  }

  async systemUserCount() {
    return this.userRepository.count();
  }

  getUserProfile(userId: number) {
    return this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.mattermostId',
        'user.userName',
        'user.displayPhoto',
        'user.email',
      ])
      .innerJoinAndSelect('user.userRole', 'userRole')
      .where('id = :userId', { userId })
      .getOne();
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

  async subdomainValidity(subdomain: string, identifier: number | string) {
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

    if (typeof identifier === 'number')
      baseQuery.andWhere('user.id = :identifier');
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

  async initializeUser(info: InitializeUserDto, res: Response) {
    const user = await this.userRepository
      .create({
        firstName: info.firstName,
        lastName: info.lastName,
        userName: info.userName,
        email: info.email,
        emailConfirmed: true,
        userRoleCode: 'SUPER_ADMIN',
        password: await bcrypt.hash(info.password, 10),
      })
      .save();

    const mattermostProfile = await this.createMattermostUserAndJoinDefaults(
      user,
    );

    const userRole = await this.userRoleRepository.findOne({
      where: {
        roleCode: 'SUPER_ADMIN',
      },
    });

    const userPayload: UserProfile = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userName: user.userName,
      mattermostId: mattermostProfile.id,
      userRole: {
        ...userRole!,
      },
    };

    const { token, id } = await this.createMattermostPersonalTokenForUser(
      mattermostProfile.id,
    );

    await this.setAccessTokens(
      {
        id: user.id,
        mattermostId: mattermostProfile.id,
        mattermostTokenId: id,
      },
      res,
      token,
    );
    return userPayload;
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
    const {
      id,
      token,
    } = await this.mattermostService.mattermostClient.createUserAccessToken(
      mattermostId,
      'Mattermost personal token for user created in octopus',
    );
    return { id, token };
  }

  async createMattermostUserAndJoinDefaults(user: UserProfile) {
    const profile = await this.mattermostService.mattermostClient.createUser(
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

    await this.mattermostService.mattermostClient.addUsersToTeam(
      this.mattermostService.octopusAppTeam!.id,
      [profile.id],
    );

    await this.mattermostService.mattermostClient.addToChannel(
      profile.id,
      this.mattermostService.octopusBroadcastChannel!.id,
    );

    return profile;
  }
}
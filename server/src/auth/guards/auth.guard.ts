import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { getJWTCookieKeys, verifyJWT } from 'helpers/jwt';
import { pick } from 'lodash';
import { AuthService } from '../services/auth.service';
import { UserPermissionOptions } from '../interfaces/user.interface';
import { ErrorTypes } from '../../../types/ErrorTypes';

const { AUTH_TOKEN_SECRET = '', AUTH_TOKEN_SECRET_REFRESH = '' } = process.env;

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector, private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const userPermissions = this.reflector.get<string[]>(
      'userPermissions',
      context.getHandler(),
    );
    const userPermissionOptions = this.reflector.get<UserPermissionOptions>(
      'userPermissionOptions',
      context.getHandler(),
    );

    const { accessTokenKey, refreshAccessTokenKey } = getJWTCookieKeys();
    const token = req.cookies[accessTokenKey];
    const refreshToken = req.cookies[refreshAccessTokenKey];

    if (!token) {
      const systemUserCount = await this.authService.systemUserCount();

      if (!systemUserCount)
        throw new UnauthorizedException(
          ErrorTypes.INITIAL_USER_SPECIFIED,
          'You need to set the initial super admin user',
        );

      throw new UnauthorizedException(
        ErrorTypes.NOT_SIGNED_IN,
        'You not authorized to use this route',
      );
    }

    await verifyJWT(token, AUTH_TOKEN_SECRET)
      .then((payload) => {
        req.user = payload;
      })
      .catch(async () => {
        try {
          const refreshPayload = await verifyJWT(
            refreshToken,
            AUTH_TOKEN_SECRET_REFRESH,
          );
          const userPayload = pick(refreshPayload, ['id', 'refreshTokenId']);

          await this.authService.verifyRefreshToken(
            userPayload.refreshTokenId,
            refreshToken,
          );

          const newRefreshTokenId = await this.authService.setAccessTokens(
            userPayload,
            res,
            req,
          );

          userPayload.refreshTokenId = newRefreshTokenId;

          req.user = userPayload;
        } catch (err: any) {
          if (userPermissionOptions.removeAccessTokens)
            this.authService.removeAccessTokens(req, res);

          const systemUserCount = await this.authService.systemUserCount();

          if (!systemUserCount)
            throw new UnauthorizedException(
              ErrorTypes.INITIAL_USER_REQUIRED,
              'You need to set the initial super admin user',
            );

          throw new UnauthorizedException(
            ErrorTypes.NOT_SIGNED_IN,
            'You not authorized to use this route',
          );
        }
      });

    if (userPermissions.length || userPermissionOptions.injectUserProfile) {
      req.userProfile = await this.authService.getUserProfile(req.user.id);

      for (const permission of userPermissions) {
        if (!req.userProfile?.userRole?.[permission])
          throw new UnauthorizedException(
            ErrorTypes.NOT_AUTHORIZED,
            'You are not authorized',
          );
      }
    }

    if (
      (userPermissions.length || userPermissionOptions.injectUserMembership) &&
      process.env.NODE_ENV !== 'development'
    ) {
      req.userMembership = await this.authService.getUserMembership(
        req.user.id,
      );
    }
    return true;
  }
}

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { verifyJWT } from 'helpers/jwt';
import { pick } from 'lodash';
import { AuthService } from '../services/auth.service';
import { UserPermissionOptions } from '../interfaces/user.interface';

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

    const token = req.cookies.OCTOPUS_ACCESS_TOKEN;
    const refreshToken = req.cookies.OCTOPUS_REFRESH_ACCESS_TOKEN;

    if (!token) {
      const systemUserCount = await this.authService.systemUserCount();

      if (!systemUserCount)
        throw new UnauthorizedException(
          'You need to set the initial super admin user',
          'INITIAL_USER_REQUIRED',
        );

      throw new UnauthorizedException(
        'You not authorized to use this route',
        'NOT_SIGNED_IN',
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
          const userPayload = pick(refreshPayload, [
            'id',
            'mattermostId',
            'mattermostTokenId',
            'refreshTokenId',
          ]);

          await this.authService.verifyRefreshToken(
            userPayload.refreshTokenId,
            refreshToken,
          );

          const newRefreshTokenId = await this.authService.setAccessTokens(
            userPayload,
            res,
          );

          userPayload.refreshTokenId = newRefreshTokenId;

          req.user = userPayload;
        } catch (err) {
          if (userPermissionOptions.removeAccessTokens)
            this.authService.removeAccessTokens(res);

          const systemUserCount = await this.authService.systemUserCount();

          if (!systemUserCount)
            throw new UnauthorizedException(
              'You need to set the initial super admin user',
              'INITIAL_USER_REQUIRED',
            );

          throw new UnauthorizedException(
            'You not authorized to use this route',
            'NOT_SIGNED_IN',
          );
        }
      });

    if (userPermissions.length || userPermissionOptions.injectUserProfile) {
      req.userProfile = await this.authService.getUserProfile(req.user.id);

      for (const permission of userPermissions) {
        if (!req.userProfile?.userRole?.[permission])
          throw new UnauthorizedException(
            'You are not authorized',
            'NOT_AUTHORIZED',
          );
      }
    }

    return true;
  }
}

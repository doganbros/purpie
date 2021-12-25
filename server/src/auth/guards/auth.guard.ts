import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { verifyJWT } from 'helpers/jwt';
import { pick } from 'lodash';
import { AuthService } from '../auth.service';

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
    const userPermissionOptions = this.reflector.get<Record<string, any>>(
      'userPermissionsOptions',
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
            'firstName',
            'lastName',
            'email',
            'userRole',
            'mattermostId',
            'refreshTokenId',
          ]);

          const refreshedUser = await this.authService.verifyRefreshToken(
            userPayload,
            refreshToken,
          );

          const refreshedUserPayload = {
            ...userPayload,
            firstName: refreshedUser.firstName,
            lastName: refreshedUser.lastName,
            email: refreshedUser.email,
            userRole: refreshedUser.userRole,
          };

          const newRefreshTokenId = await this.authService.setAccessTokens(
            refreshedUserPayload,
            res,
          );

          refreshedUserPayload.refreshTokenId = newRefreshTokenId;

          req.user = refreshedUserPayload;
        } catch (err) {
          if (userPermissionOptions.removeAccessTokens)
            this.authService.removeAccessTokens(res);

          throw new UnauthorizedException(
            'You not authorized to use this route',
            'NOT_SIGNED_IN',
          );
        }
      });

    for (const permission of userPermissions) {
      if (!req.user.userRole?.[permission])
        throw new UnauthorizedException(
          'You are not authorized',
          'NOT_AUTHORIZED',
        );
    }

    return true;
  }
}

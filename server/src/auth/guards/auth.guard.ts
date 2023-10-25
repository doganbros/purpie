import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { getJWTCookieKeys, verifyJWT } from 'helpers/jwt';
import { AuthService } from '../services/auth.service';
import { UserPermissionOptions } from '../interfaces/user.interface';
import { ErrorTypes } from '../../../types/ErrorTypes';

const { AUTH_TOKEN_SECRET = '' } = process.env;

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector, private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userPermissions = this.reflector.get<string[]>(
      'userPermissions',
      context.getHandler(),
    );
    const userPermissionOptions = this.reflector.get<UserPermissionOptions>(
      'userPermissionOptions',
      context.getHandler(),
    );

    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    let accessToken = type === 'Bearer' ? token : undefined;

    if (!accessToken) {
      const { accessTokenKey } = getJWTCookieKeys();
      accessToken = req.cookies[accessTokenKey];
    }

    if (!accessToken) {
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

    await verifyJWT(accessToken, AUTH_TOKEN_SECRET)
      .then((payload) => {
        req.user = payload;
      })
      .catch(async () => {
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

    if (userPermissions.length || userPermissionOptions.injectUserMembership) {
      req.userMembership = await this.authService.getUserMembership(
        req.user.id,
      );
    }
    return true;
  }
}

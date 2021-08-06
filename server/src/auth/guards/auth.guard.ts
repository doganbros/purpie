import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { verifyJWT } from 'helpers/jwt';
import pick from 'lodash.pick';
import { AuthService } from '../auth.service';

const { AUTH_TOKEN_SECRET = 'secret_a' } = process.env;

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

    if (!token)
      throw new UnauthorizedException(
        'You not authorized to use this route',
        'NOT_SIGNED_IN',
      );

    await verifyJWT(token, AUTH_TOKEN_SECRET)
      .then((payload) => {
        req.user = payload;
      })
      .catch(async () => {
        try {
          const refreshPayload = await verifyJWT(
            refreshToken,
            `${AUTH_TOKEN_SECRET}_REFRESH_`,
          );
          const userPayload = pick(refreshPayload, [
            'id',
            'firstName',
            'lastName',
            'email',
            'userRole',
          ]);

          const isValid = await this.authService.verifyRefreshToken(
            userPayload,
            refreshToken,
          );

          if (!isValid)
            throw new UnauthorizedException(
              'You not authorized to use this route',
              'NOT_SIGNED_IN',
            );

          await this.authService.setAccessTokens(userPayload, res);

          req.user = refreshToken;
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

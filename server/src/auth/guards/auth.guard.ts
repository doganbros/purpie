import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
import { verifyJWT } from 'helpers/jwt';

const { AUTH_TOKEN_SECRET = 'secret_a' } = process.env;

@Injectable()
export class AuthGuard implements CanActivate {
  // constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    // const userPermissions = this.reflector.get<string[]>(
    //   'userPermissions',
    //   context.getHandler(),
    // );
    // Permissions can be checked later

    const token = req.headers?.authorization?.replace('Bearer ', '');

    if (!token)
      throw new UnauthorizedException(
        'You not authorized to use this route',
        'NOT_SIGNED_IN',
      );

    try {
      const payload = await verifyJWT(token, AUTH_TOKEN_SECRET);

      req.user = payload;
    } catch (err) {
      throw new UnauthorizedException(
        'You not authorized to use this route',
        'NOT_SIGNED_IN',
      );
    }

    return true;
  }
}

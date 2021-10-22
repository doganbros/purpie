import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { verifyJWT } from 'helpers/jwt';
import { OCTOPUS_CLIENT_AUTH_TYPE } from '../constants/auth.constants';

const { AUTH_TOKEN_SECRET = '' } = process.env;

@Injectable()
export class ClientAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const clientPermissions = this.reflector.get<string[]>(
      'clientPermissions',
      context.getHandler(),
    );

    const token = req.headers?.authorization?.replace('Bearer ', '');

    if (!token)
      throw new UnauthorizedException(
        'You not authorized to use this route',
        'NOT_SIGNED_IN',
      );

    try {
      req.client = await verifyJWT(token, AUTH_TOKEN_SECRET);

      if (req.client.authType !== OCTOPUS_CLIENT_AUTH_TYPE)
        throw new Error('Invalid auth type');
    } catch (err) {
      throw new UnauthorizedException(
        'You not authorized to use this route',
        'NOT_SIGNED_IN',
      );
    }

    for (const permission of clientPermissions) {
      if (!req.client.clientRole?.[permission])
        throw new UnauthorizedException(
          'You are not authorized',
          'NOT_AUTHORIZED',
        );
    }

    return true;
  }
}

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { verifyJWT } from 'helpers/jwt';
import { PURPIE_CLIENT_AUTH_TYPE } from '../constants/auth.constants';
import { ErrorTypes } from '../../../types/ErrorTypes';

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
        ErrorTypes.NOT_SIGNED_IN,
        'You not authorized to use this route',
      );

    try {
      req.client = await verifyJWT(token, AUTH_TOKEN_SECRET);

      if (req.client.authType !== PURPIE_CLIENT_AUTH_TYPE)
        throw new Error(ErrorTypes.INVALID_AUTH_TYPE);
    } catch (err: any) {
      throw new UnauthorizedException(
        ErrorTypes.NOT_SIGNED_IN,
        'You not authorized to use this route',
      );
    }

    for (const permission of clientPermissions) {
      if (!req.client.clientRole?.[permission])
        throw new UnauthorizedException(
          ErrorTypes.NOT_AUTHORIZED,
          'You are not authorized',
        );
    }

    return true;
  }
}

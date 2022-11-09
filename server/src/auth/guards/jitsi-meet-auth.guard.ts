import {
  Injectable,
  CanActivate,
  UnauthorizedException,
  ExecutionContext,
} from '@nestjs/common';
import { verifyJWT } from 'helpers/jwt';
import { ErrorTypes } from '../../../types/ErrorTypes';

const { JITSI_SECRET = '' } = process.env;

@Injectable()
export class JitsiMeetAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const token = req.headers?.authorization?.replace('Bearer ', '');

    if (!token)
      throw new UnauthorizedException(
        ErrorTypes.NOT_SIGNED_IN,
        'You not authorized to use this route',
      );

    try {
      const payload = await verifyJWT(token, JITSI_SECRET);

      req.conferenceUser = payload?.context?.user;
      req.conferenceRoomName = payload?.room;

      if (!req.conferenceUser)
        throw new UnauthorizedException(
          ErrorTypes.NOT_SIGNED_IN,
          'You not authorized to use this route, Invalid payload',
        );
    } catch (err: any) {
      throw new UnauthorizedException(
        ErrorTypes.NOT_SIGNED_IN,
        'You not authorized to use this route',
      );
    }

    return true;
  }
}

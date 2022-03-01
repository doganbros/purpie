import {
  Injectable,
  CanActivate,
  UnauthorizedException,
  ExecutionContext,
} from '@nestjs/common';
import { verifyJWT } from 'helpers/jwt';

const { JITSI_SECRET = '' } = process.env;

@Injectable()
export class JitsiMeetAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const token = req.headers?.authorization?.replace('Bearer ', '');

    if (!token)
      throw new UnauthorizedException(
        'You not authorized to use this route',
        'NOT_SIGNED_IN',
      );

    try {
      const payload = await verifyJWT(token, JITSI_SECRET);

      req.conferenceUser = payload?.context?.user;
      req.conferenceRoomName = payload?.room;

      if (!req.conferenceUser)
        throw new UnauthorizedException(
          'You not authorized to use this route, Invalid payload',
          'NOT_SIGNED_IN',
        );
    } catch (err) {
      throw new UnauthorizedException(
        'You not authorized to use this route',
        'NOT_SIGNED_IN',
      );
    }

    return true;
  }
}

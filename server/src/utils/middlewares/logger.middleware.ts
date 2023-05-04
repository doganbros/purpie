import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { getJWTCookieKeys, verifyJWT } from '../../../helpers/jwt';
import { UserLogService } from '../../log/services/user-log.service';

const { AUTH_TOKEN_SECRET = '' } = process.env;

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private userLogService: UserLogService) {}

  use(req: any, res: Response, next: NextFunction) {
    if (req.query.channelId || req.query.zoneId) {
      const { accessTokenKey } = getJWTCookieKeys();
      const token = req.cookies[accessTokenKey];

      verifyJWT(token, AUTH_TOKEN_SECRET).then((payload) => {
        this.userLogService.createLog({
          action: req.url,
          channelId: req.query.channelId,
          payload: req.query,
          createdById: payload.id,
        });
      });
    }
    next();
  }
}

import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { PaginatedRequestQuery } from 'types/PaginationQuery';

@Injectable()
export class UtilsMiddleware implements NestMiddleware {
  use(req: PaginatedRequestQuery, _: any, next: NextFunction) {
    req.query.limit = +req.query.limit || 30;
    req.query.skip = +req.query.skip || 0;

    if (req.query.limit > 100) req.query.limit = 100;

    next();
  }
}

import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class ResponseCodeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const oldJson = res.json;
    res.json = (body) => {
      body.statusCode = res.statusCode;
      return oldJson.call(res, body);
    };
    next();
  }
}

import { Request } from 'express';
import { UserPayload } from 'src/auth/interfaces/user.interface';

export interface UserPayloadRequest<
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = qs.ParsedQs,
  Locals extends Record<string, any> = Record<string, any>
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
  user: UserPayload;
}

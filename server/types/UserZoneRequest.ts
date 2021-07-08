import { UserZone } from 'entities/UserZone.entity';
import { Request } from 'express';

export interface UserZoneRequest<
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = qs.ParsedQs,
  Locals extends Record<string, any> = Record<string, any>
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
  userZone: UserZone;
}

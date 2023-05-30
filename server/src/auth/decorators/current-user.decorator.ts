import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getJWTCookieKeys } from '../../../helpers/jwt';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);

export const CurrentUserProfile = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.userProfile;
  },
);

export const CurrentUserAccessToken = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const { accessTokenKey } = getJWTCookieKeys();
    return req.cookies[accessTokenKey];
  },
);

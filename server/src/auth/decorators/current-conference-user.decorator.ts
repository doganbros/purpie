import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentConferenceUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.conferenceUser;
  },
);

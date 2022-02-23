import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentJitsiMeetUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.jitsiMeetUser;
  },
);

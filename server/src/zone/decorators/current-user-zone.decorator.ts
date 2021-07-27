import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserZone = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.userZone;
  },
);

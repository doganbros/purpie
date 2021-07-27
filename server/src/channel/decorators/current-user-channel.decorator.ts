import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserChannel = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.userChannel;
  },
);

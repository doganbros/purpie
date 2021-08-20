import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentClient = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.client;
  },
);

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ConferenceRoomName = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.conferenceRoomName;
  },
);

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const MeetingRoomName = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.meetingSlug;
  },
);

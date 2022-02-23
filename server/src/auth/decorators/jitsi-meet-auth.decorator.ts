import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JitsiMeetAuthGuard } from '../guards/jitsi-meet-auth.guard';

export const IsJitsiMeetUserAuthenticated = () =>
  applyDecorators(
    UseGuards(JitsiMeetAuthGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      status: 401,
    }),
  );

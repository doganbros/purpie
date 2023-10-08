import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExcludeController,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { IsClientAuthenticated } from 'src/auth/decorators/client-auth.decorator';
import { ValidationBadRequest } from 'src/utils/decorators/validation-bad-request.decorator';
import { PaginationQuery } from 'types/PaginationQuery';
import { ClientStreamEventDto } from '../dto/client-stream-event.dto';
import { StreamLogResponse } from '../responses/stream.response';
import { StreamService } from '../stream.service';

@Controller({ version: '1', path: 'stream' })
@ApiTags('stream')
@ApiExcludeController()
export class StreamController {
  constructor(private readonly streamService: StreamService) {}

  @Post('client/event')
  @ApiCreatedResponse({
    description:
      'Client sends an event relating to a stream. Client must have manageStream permission.',
    schema: { type: 'string', example: 'OK' },
  })
  @ValidationBadRequest()
  @IsClientAuthenticated(['manageStream'])
  async setStreamEvent(@Body() info: ClientStreamEventDto) {
    await this.streamService.setStreamEvent(info);
    return 'OK';
  }

  @Get('logs/list/:slug')
  @ApiOkResponse({
    description: 'User gets stream logs',
    type: StreamLogResponse,
  })
  @IsAuthenticated()
  async getMeetingLogs(
    @Param('slug') slug: string,
    @Query() query: PaginationQuery,
  ) {
    return this.streamService.getStreamLogs(slug, query);
  }
}

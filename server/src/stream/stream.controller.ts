import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { IsClientAuthenticated } from 'src/auth/decorators/client-auth.decorator';
import { PaginationQueryParams } from 'src/utils/decorators/pagination-query-params.decorator';
import { ValidationBadRequest } from 'src/utils/decorators/validation-bad-request.decorator';
import { PaginationQuery } from 'types/PaginationQuery';
import { ClientStreamEventDto } from './dto/client-stream-event.dto';
import { StreamLogResponse } from './responses/stream.response';
import { StreamService } from './stream.service';

@Controller({ version: '1', path: 'stream' })
@ApiTags('stream')
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
  @PaginationQueryParams()
  @IsAuthenticated()
  async getMeetingLogs(
    @Param('slug') slug: string,
    @Query() query: PaginationQuery,
  ) {
    return this.streamService.getStreamLogs(slug, query);
  }

  @IsAuthenticated()
  @ApiOkResponse({
    description: 'Get number of people who have viewed the stream of this slug',
    schema: { type: 'number', example: 4 },
  })
  @Get('viewers/total/count/:slug')
  async getTotalViewers(@Param('slug') slug: string) {
    const result = await this.streamService.getTotalViewers(slug);

    return result.total;
  }

  @IsAuthenticated()
  @ApiOkResponse({
    description: 'Get number of people who have viewed the stream of this slug',
    schema: { type: 'number', example: 4 },
  })
  @Get('viewers/current/count/:slug')
  async getCurrentTotalViewers(@Param('slug') slug: string) {
    return this.streamService.getCurrentTotalViewers(slug);
  }
}

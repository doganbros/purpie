import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller({ path: 'channel', version: '1' })
@ApiTags('channel')
export class ChannelController {}

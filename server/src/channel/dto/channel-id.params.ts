import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ChannelIdParams {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  channelId: number;
}

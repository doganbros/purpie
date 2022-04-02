import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class ChatMessageListQuery {
  @ApiProperty({
    required: false,
    description: 'The number of records to get. Defaults to 30',
  })
  @IsOptional()
  @IsInt()
  limit: number;

  @ApiProperty({
    required: false,
    description: 'The last date of messages sent.',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastDate?: Date;
}

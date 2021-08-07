import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class MeetingIdParams {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  meetingId: number;
}

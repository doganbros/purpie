import { IsIn, IsInt, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MeetingEvent } from 'types/MeetingEvent';

const events = ['destroyed', 'created', 'joined', 'left'];
export class ClientMeetingEventDto {
  @ApiProperty({ enum: events })
  @IsIn(events)
  @IsNotEmpty()
  event: MeetingEvent;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ required: false })
  @IsInt()
  @ValidateIf((o) => ['joined', 'left'].includes(o.event))
  userId?: number;
}

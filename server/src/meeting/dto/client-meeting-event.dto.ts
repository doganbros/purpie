import { IsIn, IsInt, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MeetingEvent } from 'types/MeetingEvent';

const events = ['ended', 'started', 'user_joined', 'user_left'];
export class ClientMeetingEventDto {
  @ApiProperty({ enum: events })
  @IsIn(events)
  @IsNotEmpty()
  event: MeetingEvent;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  meetingTitle: string;

  @ApiProperty({ required: false })
  @IsInt()
  @ValidateIf((o) => ['user_joined', 'user_left'].includes(o.event))
  userId?: number;
}

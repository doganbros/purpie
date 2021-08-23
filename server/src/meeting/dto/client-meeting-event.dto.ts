import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ClientMeetingEventDto {
  @ApiProperty()
  @IsIn(['ended', 'started'])
  @IsNotEmpty()
  event: 'ended' | 'started';

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  meetingTitle: string;
}

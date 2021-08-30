import { IsIn, IsInt, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ClientMeetingEventDto {
  @ApiProperty({ enum: ['ended', 'started', 'user_joined', 'user_left'] })
  @IsIn(['ended', 'started'])
  @IsNotEmpty()
  event: 'ended' | 'started' | 'user_joined' | 'user_left';

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  meetingTitle: string;

  @ApiProperty({ required: false })
  @IsInt()
  @ValidateIf((o) => ['user_joined', 'user_left'].includes(o.event))
  userId?: number;
}

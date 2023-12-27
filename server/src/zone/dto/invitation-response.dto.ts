import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InvitationResponseDto {
  @ApiProperty({ enum: ['accept', 'reject'] })
  @IsString()
  @IsIn(['accept', 'reject'])
  @IsNotEmpty()
  status: 'accept' | 'reject';

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  invitationId: string;
}

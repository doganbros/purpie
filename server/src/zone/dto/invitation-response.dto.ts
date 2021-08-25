import { IsIn, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InvitationResponseDto {
  @ApiProperty({ enum: ['accept', 'reject'] })
  @IsString()
  @IsIn(['accept', 'reject'])
  @IsNotEmpty()
  status: 'accept' | 'reject';

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  invitationId: number;
}

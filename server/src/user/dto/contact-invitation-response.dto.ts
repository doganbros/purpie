import { IsIn, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ContactInvitationResponseDto {
  @ApiProperty({ enum: ['accept', 'reject'] })
  @IsString()
  @IsIn(['accept', 'reject'])
  @IsNotEmpty()
  status: 'accept' | 'reject';

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  contactInvitationId: number;
}

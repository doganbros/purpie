import { IsIn, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ContactInvitationResponseDto {
  @ApiProperty({ enum: ['accept', 'reject'] })
  @IsString()
  @IsIn(['accept', 'reject'])
  @IsNotEmpty()
  status: 'accept' | 'reject';

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  contactInvitationId: string;
}

import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InviteToJoinChannelDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

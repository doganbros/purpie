import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InviteToJoinDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

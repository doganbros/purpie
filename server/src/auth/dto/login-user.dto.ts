import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty()
  @IsNotEmpty()
  emailOrUserName: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

import { IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty()
  @IsNotEmpty()
  token: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'User name must be specified' })
  @Matches(/^[a-z0-9_]{1,25}$/, {
    message: 'Please enter a valid user name',
  })
  userName: string;
}

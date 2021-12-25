import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';
import { RegisterUserDto } from './register-user.dto';

export class InitializeUserDto extends RegisterUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'User name must be specified' })
  @Matches(/^[a-z0-9_]{1,25}$/, {
    message: 'Please enter a valid user name',
  })
  userName: string;
}

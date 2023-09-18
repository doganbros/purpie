import { IsNotEmpty, Matches } from 'class-validator';
import { USER_NAME_CONSTRAINT } from 'helpers/constants';
import { RegisterUserDto } from './register-user.dto';

export class InitializeUserDto extends RegisterUserDto {
  @IsNotEmpty({ message: 'User name must be specified' })
  @Matches(USER_NAME_CONSTRAINT, {
    message: 'Please enter a valid user name',
  })
  userName: string;
}

import { IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { USER_NAME_CONSTRAINT } from 'helpers/constants';

export class VerifyEmailDto {
  @ApiProperty()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: `Has to match a regular expression ${USER_NAME_CONSTRAINT}`,
    example: 'purPie_user7',
  })
  @IsNotEmpty({ message: 'User name must be specified' })
  @Matches(USER_NAME_CONSTRAINT, {
    message: 'Please enter a valid user name',
  })
  userName: string;
}

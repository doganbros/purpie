import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { USER_NAME_CONSTRAINT } from 'helpers/constants';

export class UserNameExistenceCheckDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(USER_NAME_CONSTRAINT, {
    message: 'Please enter a valid user name',
  })
  userName: string;
}

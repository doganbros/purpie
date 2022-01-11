import { IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { USER_NAME_CONSTRAINT } from 'helpers/constants';

export class UpdateProfileDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty()
  @IsString()
  @Matches(USER_NAME_CONSTRAINT, {
    message: 'Please enter a valid user name',
  })
  @IsOptional()
  userName: string;
}

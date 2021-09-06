import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserNameExistenceCheckDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userName: string;
}

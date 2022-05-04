import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlockedUserDto {
  @ApiProperty()
  @IsInt()
  userId: number;
}

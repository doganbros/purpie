import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UserZoneIdParams {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  userZoneId: number;
}

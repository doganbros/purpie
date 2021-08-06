import { IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ContactUserIdParam {
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  contactUserId: number;
}

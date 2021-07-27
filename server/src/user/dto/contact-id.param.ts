import { IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ContactIdParam {
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  contactId: number;
}

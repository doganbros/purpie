import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ZoneIdParams {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  zoneId: number;
}

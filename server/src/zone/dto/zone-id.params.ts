import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ZoneIdParams {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  @Type(() => Number)
  zoneId: string;
}

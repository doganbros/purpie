import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthByThirdPartyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  code: string;
}

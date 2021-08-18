import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginClientDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(50)
  apiKey: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  apiSecret: string;
}

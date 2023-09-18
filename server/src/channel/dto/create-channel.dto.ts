import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChannelDto {
  @ApiProperty({ maxLength: 32 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  name: string;

  @ApiPropertyOptional({
    maxLength: 256,
  })
  @IsString()
  @IsOptional()
  @MaxLength(256)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  public?: boolean;
}

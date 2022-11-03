import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChannelDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  name: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(256)
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  public?: boolean;
}

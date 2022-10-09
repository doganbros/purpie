import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateZoneDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: false,
  })
  @IsInt()
  @IsOptional()
  categoryId?: number;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(/([a-z.])+([a-z])$/, { message: 'Please enter a valid subdomain' })
  subdomain: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public?: boolean;
}

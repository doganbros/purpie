import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditZoneDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  @Matches(/([a-z.])+([a-z])$/, { message: 'Please enter a valid subdomain' })
  subdomain?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  public?: boolean;
}

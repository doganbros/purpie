import {
  IsBoolean,
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

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(/([a-z.])+([a-z])$/g, { message: 'Please enter a valid subdomain' })
  subdomain: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  public?: boolean;
}

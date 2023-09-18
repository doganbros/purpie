import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class EditZoneDto {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsOptional()
  @Matches(/^(?![0-9]+$)(?!.*-$)(?!-)[a-zA-Z0-9-]{6,32}$/, {
    message: 'Please enter a valid subdomain',
  })
  subdomain?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  public?: boolean;
}

import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class EditPostDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(10)
  description: string;

  @ApiPropertyOptional()
  @IsBoolean()
  public?: boolean;
}

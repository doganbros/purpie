import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EditPostDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description: string;

  @ApiPropertyOptional()
  @IsBoolean()
  public?: boolean;
}

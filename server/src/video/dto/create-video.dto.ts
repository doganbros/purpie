import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateVideoDto {
  @ApiPropertyOptional({ maxLength: 64 })
  @IsString()
  @MaxLength(64)
  title: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(10)
  description?: string;

  @ApiPropertyOptional()
  @ValidateIf((o) => {
    return !o.public;
  })
  channelId?: string;

  @ApiPropertyOptional()
  @ValidateIf((o) => {
    return !o.channelId;
  })
  @Transform(({ value }) => ['true', true, 1, '1'].includes(value))
  public?: boolean;

  @ApiProperty({ type: String, format: 'binary' })
  videoFile: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => ['true', true, 1, '1'].includes(value))
  @IsOptional()
  @IsBoolean()
  allowDislike?: boolean;

  @ApiPropertyOptional()
  @Transform(({ value }) => ['true', true, 1, '1'].includes(value))
  @IsOptional()
  @IsBoolean()
  allowReaction?: boolean;

  @ApiPropertyOptional()
  @Transform(({ value }) => ['true', true, 1, '1'].includes(value))
  @IsOptional()
  @IsBoolean()
  allowComment?: boolean;
}

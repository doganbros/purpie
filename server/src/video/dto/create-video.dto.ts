import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateVideoDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @ValidateIf((o) => {
    return !o.public;
  })
  @IsUUID()
  channelId?: string;

  @ApiPropertyOptional()
  @ValidateIf((o) => {
    return !o.channelId;
  })
  @Transform(({ value }) => ['true', true, 1, '1'].includes(value))
  @IsBoolean()
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

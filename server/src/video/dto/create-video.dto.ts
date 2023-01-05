import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateVideoDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @ValidateIf((o) => {
    return !o.public;
  })
  @IsUUID()
  @Transform(({ value }) => Number.parseInt(value, 10))
  channelId?: string;

  @ApiProperty({ required: false })
  @ValidateIf((o) => {
    return !o.channelId;
  })
  @Transform(({ value }) => ['true', true, 1, '1'].includes(value))
  @IsBoolean()
  public?: boolean;

  @ApiProperty({ type: String, format: 'binary' })
  videoFile: string;

  @ApiProperty({ required: false })
  @Transform(({ value }) => ['true', true, 1, '1'].includes(value))
  @IsOptional()
  @IsBoolean()
  allowDislike?: boolean;

  @ApiProperty({ required: false })
  @Transform(({ value }) => ['true', true, 1, '1'].includes(value))
  @IsOptional()
  @IsBoolean()
  allowReaction?: boolean;

  @ApiProperty({ required: false })
  @Transform(({ value }) => ['true', true, 1, '1'].includes(value))
  @IsOptional()
  @IsBoolean()
  allowComment?: boolean;
}

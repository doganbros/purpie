import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateVideoPostDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @ValidateIf((o) => {
    return !o.userContactExclusive && !o.public;
  })
  @IsInt()
  @Transform(({ value }) => Number.parseInt(value, 10))
  channelId?: number;

  @ApiProperty({ required: false })
  @ValidateIf((o) => {
    return !o.userContactExclusive && !o.channelId;
  })
  @Transform(({ value }) => ['true', true, 1, '1'].includes(value))
  @IsBoolean()
  public?: boolean;

  @ApiProperty({ required: false })
  @Transform(({ value }) => ['true', true, 1, '1'].includes(value))
  @ValidateIf((o) => {
    return !o.channelId && !o.public;
  })
  @IsBoolean()
  userContactExclusive?: boolean;

  @ApiProperty({ type: String, format: 'binary' })
  videoFile: string;
}

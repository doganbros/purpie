import {
  IsArray,
  IsBoolean,
  IsDate,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinDate,
  ValidateIf,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { JitsiConfig } from 'types/Meeting';
import { timeZones } from 'entities/data/time-zones';

export class CreateMeetingDto {
  @ApiPropertyOptional({ maxLength: 64 })
  @IsString()
  @IsOptional()
  @MaxLength(64)
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @MinDate(new Date())
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  channelId?: string;

  @ApiPropertyOptional()
  @ValidateIf((o) => {
    return !o.channelId;
  })
  @IsBoolean()
  public?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  config?: JitsiConfig;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  saveConfig?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  liveStream?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  allowDislike?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  allowReaction?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  allowComment?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  record?: boolean;

  @ApiPropertyOptional({ type: Number, isArray: true })
  @IsOptional()
  @IsArray()
  invitationIds?: Array<number>;

  @ApiPropertyOptional({ enum: timeZones })
  @IsOptional()
  @IsNotEmpty()
  @IsIn(timeZones, { message: 'Invalid timezone option specified' })
  timeZone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  joinLinkExpiryAsHours?: number;
}

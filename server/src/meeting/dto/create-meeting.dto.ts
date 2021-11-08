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
  MinDate,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { JitsiConfig } from 'types/Meeting';
import { timeZones } from 'entities/data/time-zones';

export class CreateMeetingDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  @MinDate(new Date())
  @Type(() => Date)
  startDate?: Date;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @ApiProperty()
  @ValidateIf((o) => {
    return !o.userContactExclusive && !o.public;
  })
  @IsInt()
  channelId?: number;

  @ApiProperty()
  @ValidateIf((o) => {
    return !o.userContactExclusive && !o.channelId;
  })
  @IsBoolean()
  public?: boolean;

  @ApiProperty()
  @ValidateIf((o) => {
    return !o.channelId && !o.public;
  })
  @IsBoolean()
  userContactExclusive?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  config?: JitsiConfig;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  saveConfig?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  liveStream?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  record?: boolean;

  @ApiProperty({ type: Number, isArray: true })
  @IsOptional()
  @IsArray()
  invitationIds?: Array<number>;

  @ApiProperty({ enum: timeZones })
  @IsOptional()
  @IsNotEmpty()
  @IsIn(timeZones, { message: 'Invalid timezone option specified' })
  timeZone?: string;
}

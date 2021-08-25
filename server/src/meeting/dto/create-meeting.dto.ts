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
import { MeetingConfig } from 'types/Meeting';
import { timeZones } from 'entities/data/time-zones';

export class CreateMeetingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
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
  @ValidateIf((o) => {
    return !o.zoneId && !o.userContactExclusive && !o.public;
  })
  @IsInt()
  channelId?: number;

  @ApiProperty()
  @ValidateIf((o) => {
    return !o.zoneId && !o.userContactExclusive && !o.channelId;
  })
  @IsBoolean()
  public?: boolean;

  @ApiProperty()
  @ValidateIf((o) => {
    return !o.zoneId && !o.channelId && !o.public;
  })
  @IsBoolean()
  userContactExclusive?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  config?: MeetingConfig;

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

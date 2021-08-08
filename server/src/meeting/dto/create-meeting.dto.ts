import {
  IsBoolean,
  IsDate,
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
    return !o.public && !o.userContactExclusive && !o.channelId;
  })
  @IsInt()
  zoneId?: number;

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
}

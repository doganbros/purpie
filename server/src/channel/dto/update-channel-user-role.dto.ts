import { IsIn, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ChannelRoleCode, ChannelRoleCodeValues } from 'types/RoleCodes';

export class UpdateChannelUserRoleDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  channelId: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ enum: ChannelRoleCodeValues })
  @IsString()
  @IsIn(ChannelRoleCodeValues)
  channelRoleCode: ChannelRoleCode;
}

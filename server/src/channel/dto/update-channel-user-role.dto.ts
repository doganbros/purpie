import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ChannelRoleCode } from 'types/RoleCodes';

export class UpdateChannelUserRoleDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsString()
  channelRoleCode: ChannelRoleCode;
}

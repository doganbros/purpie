import { IsInt, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ChannelRoleCode } from 'types/RoleCodes';

export class UpdateChannelUserRoleDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsString()
  channelRoleCode: ChannelRoleCode;
}

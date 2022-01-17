import { IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoleCode } from 'types/RoleCodes';

export class SetUserRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  roleCode: UserRoleCode;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  userId: number;
}

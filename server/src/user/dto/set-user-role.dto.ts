import { IsNotEmpty, IsIn, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoleCode } from 'types/RoleCodes';

export class SetUserRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsIn(['SUPER_ADMIN', 'ADMIN', 'NORMAL'])
  roleCode: UserRoleCode;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  userId: number;
}

import { IsIn, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ClientRoleCode } from 'types/RoleCodes';

export class CreateClientDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsIn(['SUPER_ADMIN', 'ADMIN', 'NORMAL'])
  @IsNotEmpty()
  roleCode: ClientRoleCode;
}

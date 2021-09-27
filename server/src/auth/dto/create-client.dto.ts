import { IsIn, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ClientRoleCode } from 'types/RoleCodes';

export class CreateClientDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: ['SUPER_ADMIN', 'ADMIN', 'NORMAL'] })
  @IsIn(['SUPER_ADMIN', 'ADMIN', 'NORMAL'])
  @IsNotEmpty()
  roleCode: ClientRoleCode;
}

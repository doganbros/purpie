import { ApiPropertyOptional } from '@nestjs/swagger';
import { ZoneRoleCode } from '../../../types/RoleCodes';

export class UpdateZonePermission {
  @ApiPropertyOptional()
  roleCode: ZoneRoleCode;

  @ApiPropertyOptional()
  zoneId: string;

  @ApiPropertyOptional()
  canCreateChannel: boolean;

  @ApiPropertyOptional()
  canInvite: boolean;

  @ApiPropertyOptional()
  canDelete: boolean;

  @ApiPropertyOptional()
  canEdit: boolean;

  @ApiPropertyOptional()
  canManageRole: boolean;
}

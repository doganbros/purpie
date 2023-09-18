import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ZoneRoleCode } from '../../../types/RoleCodes';

class ZoneUser {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  email: string;
}

class ZoneForUserZoneList {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  subdomain: string;

  @ApiPropertyOptional()
  displayPhoto: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  public: boolean;

  @ApiProperty()
  createdBy: ZoneUser;
}

export class UserZoneRoleResponse {
  @ApiProperty({ enum: ZoneRoleCode })
  roleCode: ZoneRoleCode;

  @ApiProperty()
  zoneId: string;

  @ApiProperty()
  roleName: string;

  @ApiProperty()
  canCreateChannel: boolean;

  @ApiProperty()
  canInvite: boolean;

  @ApiProperty()
  canDelete: boolean;

  @ApiProperty()
  canEdit: boolean;

  @ApiProperty()
  canManageRole: boolean;
}

export class UserZoneListResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdOn: Date;

  @ApiProperty()
  zone: ZoneForUserZoneList;

  @ApiProperty()
  zoneRole: UserZoneRoleResponse;
}

export const UserZoneDetailResponse = UserZoneListResponse;

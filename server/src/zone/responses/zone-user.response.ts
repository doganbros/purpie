import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserZoneRoleResponse } from './user-zone.response';

class User {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  displayPhoto: string;
}

class ZoneUserItem {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdOn: Date;

  @ApiProperty()
  user: User;

  @ApiProperty()
  zoneRole: UserZoneRoleResponse;
}

export class ZoneUserResponse {
  @ApiProperty({ isArray: true })
  data: ZoneUserItem;

  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  skip: number;
}

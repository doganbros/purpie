import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'entities/Category.entity';
import { ZoneRole } from 'entities/ZoneRole.entity';

class ZoneForUserZoneList {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  subdomain: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  public: boolean;

  @ApiProperty()
  category: Category;
}

export class UserZoneListResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdOn: Date;

  @ApiProperty()
  zone: ZoneForUserZoneList;

  @ApiProperty()
  zoneRole: ZoneRole;
}

export const UserZoneDetailResponse = UserZoneListResponse;

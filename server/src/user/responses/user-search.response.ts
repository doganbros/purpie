import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class SearchUser {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  userName: string;

  @ApiPropertyOptional()
  displayPhoto: string;

  @ApiPropertyOptional()
  contactUserId: string;

  @ApiPropertyOptional()
  invited: boolean;
}

export class UserSearchResponse {
  @ApiProperty({ isArray: true })
  data: SearchUser;

  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  skip: number;
}

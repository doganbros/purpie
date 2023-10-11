import { ApiProperty } from '@nestjs/swagger';

class Inviter {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  displayPhoto: string;
}

class ContactInvitationList {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdOn: Date;

  @ApiProperty()
  inviter: Inviter;
}

export class ContactInvitationListResponse {
  @ApiProperty({ isArray: true })
  data: ContactInvitationList;

  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  skip: number;
}

class ContactUser {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  fullName: string;
}

class ContactList {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdOn: Date;

  @ApiProperty()
  contactUser: ContactUser;
}

export class ContactListResponse {
  @ApiProperty({ isArray: true })
  data: ContactList;

  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  skip: number;
}

export class UserNameExistenceCheckResponse {
  @ApiProperty()
  userName: string;

  @ApiProperty()
  exist: boolean;

  @ApiProperty({ isArray: true })
  suggestions: string;
}

import { ApiProperty } from '@nestjs/swagger';

class Inviter {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

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
  @ApiProperty()
  data: Array<ContactInvitationList>;

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
  firstName: string;

  @ApiProperty()
  lastName: string;
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
  userName: string;

  exist: boolean;
}

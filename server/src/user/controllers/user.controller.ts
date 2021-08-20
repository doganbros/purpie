import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserPayload } from 'src/auth/interfaces/user.interface';
import { PaginationQueryParams } from 'src/utils/decorators/pagination-query-params.decorator';
import { PaginationQuery } from 'types/PaginationQuery';
import { ContactIdParam } from '../dto/contact-id.param';
import { ContactInvitationResponseDto } from '../dto/contact-invitation-response.dto';
import { CreateContactDto } from '../dto/create-contact.dto';
import { SearchUsersQuery } from '../dto/search-users.query';
import { UserService } from '../user.service';

@Controller({ path: 'user', version: '1' })
@ApiTags('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/contact/invitation/response')
  @IsAuthenticated()
  async contactInvitationResponse(
    @CurrentUser() currentUser: UserPayload,
    @Body() { contactInvitationId, status }: ContactInvitationResponseDto,
  ) {
    const invitation = await this.userService.getContactInvitationByIdAndInviteeId(
      contactInvitationId,
      currentUser.id,
    );

    if (!invitation)
      throw new NotFoundException('Contact Invitation not found');

    if (status === 'reject') {
      await this.userService.removeContactInvitation(contactInvitationId);
      return 'OK';
    }

    await this.userService.createNewContact(
      invitation.inviterId,
      invitation.inviteeId,
    );

    await this.userService.removeContactInvitation(contactInvitationId);
    return 'OK';
  }

  @Post('/contact/invitation/create')
  @IsAuthenticated()
  async createNewContactInvitation(
    @CurrentUser() currentUser: UserPayload,
    @Body() { userId }: CreateContactDto,
  ) {
    const contactInvitation = await this.userService.createNewContactInvitation(
      currentUser.id,
      userId,
    );

    return contactInvitation;
  }

  @Get('/search')
  @IsAuthenticated()
  @PaginationQueryParams()
  @ApiQuery({
    name: 'excludeCurrentUser',
    description:
      'Exclude current user in search. Specify false to disable this.',
    type: String,
    required: false,
  })
  async searchUsers(
    @CurrentUser() currentUser: UserPayload,
    @Query() query: SearchUsersQuery,
  ) {
    const users = await this.userService.searchUsers(
      query.excludeCurrentUser === 'false' ? [] : [currentUser.id],
      query as any,
    );

    return users;
  }

  @Get('/contact/invitation/list')
  @PaginationQueryParams()
  @IsAuthenticated()
  async getContactInvitations(
    @CurrentUser() currentUser: UserPayload,
    @Query() paginatedQuery: PaginationQuery,
  ) {
    const contactInvitation = await this.userService.listContactInvitations(
      currentUser.id,
      paginatedQuery,
    );

    return contactInvitation;
  }

  @Get('/contact/list')
  @PaginationQueryParams()
  @IsAuthenticated()
  async listContacts(
    @CurrentUser() currentUser: UserPayload,
    @Query() paginatedQuery: PaginationQuery,
  ) {
    return this.userService.listContacts(currentUser.id, paginatedQuery);
  }

  @Delete('/contact/remove/:contactId')
  @IsAuthenticated()
  async deleteContact(
    @CurrentUser() currentUser: UserPayload,
    @Param() { contactId }: ContactIdParam,
  ) {
    return this.userService.deleteContact(currentUser.id, contactId);
  }
}

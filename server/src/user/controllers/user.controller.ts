import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseArrayPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserPayload } from 'src/auth/interfaces/user.interface';
import { PaginationQueryParams } from 'src/utils/decorators/pagination-query-params.decorator';
import { ValidationBadRequest } from 'src/utils/decorators/validation-bad-request.decorator';
import { emptyPaginatedResponse } from 'helpers/utils';
import { PaginationQuery } from 'types/PaginationQuery';
import { UserNameExistenceCheckDto } from 'src/meeting/dto/user-name-existence-check.dto';
import { ContactIdParam } from '../dto/contact-id.param';
import { ContactInvitationResponseDto } from '../dto/contact-invitation-response.dto';
import {
  ContactInvitationListResponse,
  ContactListResponse,
  UserNameExistenceCheckResponse,
} from '../responses/user.reponse';
import { CreateContactDto } from '../dto/create-contact.dto';
import { SearchUsersQuery } from '../dto/search-users.query';
import { SetUserRoleDto } from '../dto/set-user-role.dto';
import { UserService } from '../user.service';

@Controller({ path: 'user', version: '1' })
@ApiTags('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/contact/invitation/response')
  @ApiCreatedResponse({
    description: 'User responds to contact invitation',
    schema: { type: 'string', example: 'OK' },
  })
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
  @ApiCreatedResponse({
    description: 'User creates a new contact invitation',
    schema: { type: 'integer' },
  })
  @IsAuthenticated()
  async createNewContactInvitation(
    @CurrentUser() currentUser: UserPayload,
    @Body() { userId }: CreateContactDto,
  ) {
    const contactInvitation = await this.userService.createNewContactInvitation(
      currentUser.id,
      userId,
    );

    return contactInvitation.id;
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
    @Query(
      'excludeIds',
      new DefaultValuePipe('-1'),
      new ParseArrayPipe({ items: Number, separator: ',' }),
    )
    excludeIds: Array<number>,
  ) {
    if (!query.name.trim())
      return emptyPaginatedResponse(query.limit, query.skip);
    if (query.channelId) {
      const users = await this.userService.searchInChannels(
        query.channelId,
        excludeIds,
        query,
      );
      return users;
    }
    if (query.userContacts === 'true') {
      const users = await this.userService.searchInUserContacts(
        currentUser.id,
        excludeIds,
        query,
      );
      return users;
    }
    const users = await this.userService.searchUsers(excludeIds, query);
    return users;
  }

  @Get('/contact/invitation/list')
  @ApiOkResponse({
    description: 'User lists their contact invitation list',
    type: ContactInvitationListResponse,
  })
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

  @Post('/set/role')
  @ApiCreatedResponse({
    description: 'User sets a role. User must have canSetRole permission',
    schema: { type: 'string', example: 'OK' },
  })
  @ValidationBadRequest()
  @IsAuthenticated(['canSetRole'])
  async setRole(@Body() info: SetUserRoleDto) {
    await this.userService.setUserRole(info);
    return 'OK';
  }

  @Post('user-name-check')
  @ApiCreatedResponse({
    description: 'Checks if user name provided has already been taken.',
    type: UserNameExistenceCheckResponse,
  })
  @ValidationBadRequest()
  async userNameExistenceCheck(@Body() info: UserNameExistenceCheckDto) {
    const user = await this.userService.userNameExists(info.userName);
    return { userName: info.userName, exists: !!user };
  }

  @Get('/contact/list')
  @PaginationQueryParams()
  @ApiOkResponse({
    description: 'User lists contact',
    type: ContactListResponse,
  })
  @IsAuthenticated()
  async listContacts(
    @CurrentUser() currentUser: UserPayload,
    @Query() paginatedQuery: PaginationQuery,
  ) {
    return this.userService.listContacts(currentUser.id, paginatedQuery);
  }

  @Delete('/contact/remove/:contactId')
  @ApiOkResponse({
    description: 'User removes a contact by id',
    schema: { type: 'string', example: 'OK' },
  })
  @HttpCode(HttpStatus.OK)
  @IsAuthenticated()
  async deleteContact(
    @CurrentUser() currentUser: UserPayload,
    @Param() { contactId }: ContactIdParam,
  ) {
    await this.userService.deleteContact(currentUser.id, contactId);
    return 'OK';
  }
}

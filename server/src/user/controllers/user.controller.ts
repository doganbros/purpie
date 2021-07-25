import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserPayload } from 'src/auth/interfaces/user.interface';
import { PaginationQueryParams } from 'src/utils/decorators/pagination-query-params.decorator';
import { PaginationQuery } from 'types/PaginationQuery';
import { ContactIdParam } from '../dto/contact-id.param';
import { CreateContactDto } from '../dto/create-contact.dto';
import { UserService } from '../user.service';

@Controller({ path: 'user', version: '1' })
@ApiTags('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/contact')
  @IsAuthenticated()
  async createNewContact(
    @CurrentUser() currentUser: UserPayload,
    @Body() { userId }: CreateContactDto,
  ) {
    const contact = await this.userService.createNewContact(
      currentUser.id,
      userId,
    );

    return contact;
  }

  @Get('/contact')
  @PaginationQueryParams()
  @IsAuthenticated()
  async listContacts(
    @CurrentUser() currentUser: UserPayload,
    @Query() paginatedQuery: PaginationQuery,
  ) {
    return this.userService.listContacts(currentUser.id, paginatedQuery);
  }

  @Delete('/contact/:contactId')
  @IsAuthenticated()
  async deleteContact(
    @CurrentUser() currentUser: UserPayload,
    @Param() { contactId }: ContactIdParam,
  ) {
    return this.userService.deleteContact(currentUser.id, contactId);
  }
}

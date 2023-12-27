import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseArrayPipe,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Express, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import {
  CurrentUser,
  CurrentUserProfile,
} from 'src/auth/decorators/current-user.decorator';
import { deleteObject, s3, s3HeadObject, s3Storage } from 'config/s3-storage';
import {
  UserProfile,
  UserTokenPayload,
} from 'src/auth/interfaces/user.interface';
import { ValidationBadRequest } from 'src/utils/decorators/validation-bad-request.decorator';
import { EventEmitter2 } from '@nestjs/event-emitter';
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
import { UserService } from '../services/user.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UserEvent } from '../listeners/user.event';
import { ErrorTypes } from '../../../types/ErrorTypes';
import { errorResponseDoc } from '../../../helpers/error-response-doc';
import { UserSearchResponse } from '../responses/user-search.response';
import { UserZoneResponse } from '../responses/user-zone.response';
import { UserChannelResponse } from '../responses/user-channel.response';

const { S3_PROFILE_PHOTO_DIR = '', S3_BUCKET_NAME = '' } = process.env;

@Controller({ path: 'user', version: '1' })
@ApiTags('User')
export class UserController {
  constructor(
    private userService: UserService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post('/contact/invitation/response')
  @ApiCreatedResponse({
    description: 'User responds to contact invitation',
    schema: { type: 'string', example: 'OK' },
  })
  @ApiOperation({
    summary: 'Respond Contact Invitation',
    description: 'Respond contact invitation with request payload.',
  })
  @ApiNotFoundResponse({
    description:
      'Error thrown when the requested contact invitation not found.',
    schema: errorResponseDoc(
      404,
      'Contact Invitation not found',
      'CONTACT_INVITATION_NOT_FOUND',
    ),
  })
  @ApiBadRequestResponse({
    description:
      'Error thrown when the requested contact id is same as authenticated user id.',
    schema: errorResponseDoc(
      404,
      'You cannot add yourself to your contacts',
      'CONTACT_ELIGIBILITY_ERROR',
    ),
  })
  @IsAuthenticated()
  async contactInvitationResponse(
    @CurrentUser() user: UserTokenPayload,
    @Body() { contactInvitationId, status }: ContactInvitationResponseDto,
  ) {
    const invitation = await this.userService.getContactInvitationByIdAndInviteeId(
      contactInvitationId,
      user.id,
    );

    if (!invitation)
      throw new NotFoundException(
        ErrorTypes.CONTACT_INVITATION_NOT_FOUND,
        'Contact Invitation not found',
      );

    if (status === 'reject') {
      await this.userService.removeContactInvitation(contactInvitationId);
      return 'OK';
    }

    await this.userService.createNewContact(user.id, invitation.createdById);

    this.eventEmitter.emit(UserEvent.acceptContactRequestNotification, {
      userId: user.id,
      createdById: invitation.createdById,
    });

    await this.userService.removeContactInvitation(contactInvitationId);
    return 'OK';
  }

  @Post('/contact/invitation/create')
  @ApiOperation({
    summary: 'Create Contact Invitation',
    description:
      'Authenticated user creates a new contact invitation for a user belonging to email.',
  })
  @ApiCreatedResponse({
    description: 'User creates a new contact invitation',
    schema: { type: 'integer' },
  })
  @ApiBadRequestResponse({
    description:
      'Error thrown when the user already sent invitation to requested email.',
    schema: errorResponseDoc(
      400,
      'Invitation to this user has already been sent',
      'INVITATION_ALREADY_SENT_FOR_USER',
    ),
  })
  @ApiConflictResponse({
    description: 'Error thrown when the user already received invitation .',
    schema: errorResponseDoc(
      400,
      'You have already been invited by this user',
      'INVITATION_ALREADY_RECEIVED_FROM_USER',
    ),
  })
  @IsAuthenticated()
  async createNewContactInvitation(
    @CurrentUser() user: UserTokenPayload,
    @Body() { email }: CreateContactDto,
  ) {
    const invitationInviteeUserId = await this.userService.createNewContactInvitation(
      email,
      user,
    );

    this.eventEmitter.emit(UserEvent.sendContactRequestNotification, {
      user,
      email,
    });

    return invitationInviteeUserId;
  }

  @Get('invitations/list')
  @ApiOperation({
    summary: 'List Invitations',
    description: 'User lists all invitations, contacts, channels, zones.',
  })
  @ApiOkResponse({
    description: 'Lists all invitations',
    type: ContactInvitationListResponse,
  })
  @IsAuthenticated()
  async getUserInvitations(
    @CurrentUser() user: UserTokenPayload,
    @Query() paginatedQuery: PaginationQuery,
  ) {
    return this.userService.listInvitationsForUser(user.id, paginatedQuery);
  }

  @Get('/contact/list')
  @ApiOperation({
    summary: 'List Contacts',
    description: 'User lists contacts.',
  })
  @ApiOkResponse({
    description: 'User lists contacts',
    type: ContactListResponse,
  })
  @IsAuthenticated()
  async listContacts(
    @CurrentUser() user: UserTokenPayload,
    @Query() paginatedQuery: PaginationQuery,
  ) {
    return this.userService.listContacts({ userId: user.id }, paginatedQuery);
  }

  @Get('/contact/list/:userName')
  @ApiOperation({
    summary: 'List User Contact',
    description: 'User lists another public users contacts',
  })
  @ApiOkResponse({
    description: `User lists another public users contacts`,
    type: ContactListResponse,
  })
  @IsAuthenticated()
  listPublicUserContacts(
    @Param('userName') userName: string,
    @Query() paginatedQuery: PaginationQuery,
  ) {
    return this.userService.listContacts({ userName }, paginatedQuery);
  }

  @Delete('/contact/remove/:contactId')
  @ApiOperation({
    summary: 'Delete Contact',
    description: 'User deletes a contact with requested "contactId."',
  })
  @ApiOkResponse({
    description: 'User removes a contact by id',
    schema: { type: 'string', example: 'OK' },
  })
  @HttpCode(HttpStatus.OK)
  @IsAuthenticated()
  async deleteContact(
    @CurrentUser() user: UserTokenPayload,
    @Param() { contactId }: ContactIdParam,
  ) {
    await this.userService.deleteContact(user.id, contactId);
    return 'OK';
  }

  @Get('/search')
  @ApiOperation({
    summary: 'Search Users',
    description: 'Search user with requested payload.',
  })
  @IsAuthenticated()
  @ApiQuery({
    name: 'excludeCurrentUser',
    description:
      'Exclude current user in search. Specify false to disable this.',
    type: String,
    required: false,
  })
  @ApiOkResponse({
    description: 'Search user with requested payload',
    type: UserSearchResponse,
  })
  async searchUsers(
    @CurrentUser() user: UserTokenPayload,
    @Query() query: SearchUsersQuery,
    @Query(
      'excludeIds',
      new ParseArrayPipe({ items: String, optional: true, separator: ',' }),
    )
    excludeIds: string[],
  ) {
    if (!query.name.trim())
      return emptyPaginatedResponse(query.limit, query.skip);
    if (query.channelId) {
      const users = await this.userService.searchInChannels(
        user.id,
        query.channelId,
        excludeIds,
        query,
      );
      return users;
    }
    if (query.userContacts === 'true') {
      const users = await this.userService.searchInUserContacts(
        user.id,
        excludeIds,
        query,
      );
      return users;
    }
    const users = await this.userService.searchUsers(
      user.id,
      excludeIds,
      query,
    );
    return users;
  }

  @Put('/role/change')
  @ApiOperation({
    summary: 'Update User Role',
    description:
      'User changes a role for an existing user. User must have "canManageRole" permission',
  })
  @ApiCreatedResponse({
    description: 'Update user role',
    schema: { type: 'string', example: 'OK' },
  })
  @ApiForbiddenResponse({
    description: 'Error thrown when changed user role is last super admin.',
    schema: errorResponseDoc(
      403,
      'There must be at least one super admin',
      'SUPER_ADMIN_NOT_EXIST',
    ),
  })
  @ValidationBadRequest()
  @IsAuthenticated(['canManageRole'])
  async changeUserRole(@Body() info: SetUserRoleDto) {
    await this.userService.changeUserRole(info);
    return 'OK';
  }

  @Post('user-name-check')
  @ApiOperation({
    summary: 'Check Username',
    description: 'Checks if user name provided has already been taken.',
  })
  @ApiCreatedResponse({
    description: 'Checked username',
    type: UserNameExistenceCheckResponse,
  })
  @ValidationBadRequest()
  async userNameExistenceCheck(@Body() info: UserNameExistenceCheckDto) {
    const user = await this.userService.userNameExists(info.userName);

    return {
      userName: info.userName,
      exists: !!user,
      suggestions: user
        ? await this.userService.userNameSuggestions(info.userName)
        : [],
    };
  }

  @Get('/zone/list/:userName')
  @ApiOperation({
    summary: 'List User Zones',
    description: 'List public zones of user belonging to "userName" parameter.',
  })
  @ApiOkResponse({
    description: 'List requested user public zones',
    type: UserZoneResponse,
  })
  @IsAuthenticated()
  listPublicUserZones(
    @CurrentUser() user: UserTokenPayload,
    @Param('userName') userName: string,
    @Query() query: PaginationQuery,
  ) {
    return this.userService.getUserZones(user.id, userName, query);
  }

  @Get('/channel/list/:userName')
  @ApiOperation({
    summary: 'List User Channels',
    description:
      'List public channels of user belonging to "userName" parameter.',
  })
  @ApiOkResponse({
    description: 'List requested user public channels',
    type: UserChannelResponse,
  })
  @IsAuthenticated()
  listPublicUserChannels(
    @CurrentUser() user: UserTokenPayload,
    @Param('userName') userName: string,
    @Query() query: PaginationQuery,
  ) {
    return this.userService.getUserChannels(user.id, userName, query);
  }

  @Get('profile')
  @ApiOperation({
    summary: 'Get Profile',
    description: 'Get authenticated user profile informations.',
  })
  @ApiOkResponse({
    description: 'Get authenticated user profile informations.',
    type: UserProfile,
  })
  @IsAuthenticated([], { injectUserProfile: true })
  getUserProfile(@CurrentUserProfile() userProfile: UserProfile) {
    return userProfile;
  }

  @Get('profile/:userName')
  @ApiOperation({
    summary: 'Get User Profile',
    description:
      'Get public user profile informations belonging to "userName".',
  })
  @IsAuthenticated()
  @ApiOkResponse({
    description: 'Get public specified user profile informations.',
    type: UserProfile,
  })
  getPublicUserProfile(
    @Param('userName') userName: string,
    @CurrentUser() user: UserTokenPayload,
  ) {
    return this.userService.getPublicUserProfile(user.id, userName);
  }

  @Put('profile')
  @ApiOkResponse({
    description:
      'Updates authenticated user profile informations with given request.',
  })
  @ApiOperation({
    summary: 'Update Profile',
    description:
      'Updates authenticated user profile informations with requested parameters.',
  })
  @ApiNotFoundResponse({
    description:
      'Error thrown when authenticated user informations are not found.',
    schema: errorResponseDoc(404, 'User profile not found', 'USER_NOT_FOUND'),
  })
  @ApiBadRequestResponse({
    description:
      'Error thrown when detected no changes between requested payload and current user information.',
    schema: errorResponseDoc(400, 'No Changes detected', 'NO_CHANGES_DETECTED'),
  })
  @IsAuthenticated()
  async updateUserProfile(
    @CurrentUser() user: UserTokenPayload,
    @Body() info: UpdateProfileDto,
  ) {
    await this.userService.updateProfile(user.id, info);
  }

  @Put('display-photo')
  @ApiOperation({
    summary: 'Update Display Photo',
    description:
      'Updates display photo of user with requested photo file and return new photo file URL.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    description: 'Updates display photo',
    schema: {
      type: 'string',
      description: 'Currently uploaded photo file url',
    },
  })
  @ApiBadRequestResponse({
    description:
      'Error thrown when the requested photo format invalid. Valid formats: jpg, jpeg, png, bmp and svg',
    schema: errorResponseDoc(
      400,
      'Please upload a valid photo format',
      'INVALID_IMAGE_FORMAT',
    ),
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        photoFile: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('photoFile', {
      storage: s3Storage(`${S3_PROFILE_PHOTO_DIR}/user-dp/`),
      fileFilter(_: any, file, cb) {
        const { mimetype } = file;

        const isValid = [
          'image/jpg',
          'image/jpeg',
          'image/png',
          'image/bmp',
          'image/svg+xml',
        ].includes(mimetype);

        if (!isValid)
          return cb(
            new BadRequestException(
              ErrorTypes.INVALID_IMAGE_FORMAT,
              'Please upload a valid photo format',
            ),
            false,
          );

        return cb(null, true);
      },
    }),
  )
  @IsAuthenticated()
  @ValidationBadRequest()
  async changeDisplayPhoto(
    @CurrentUser() user: UserTokenPayload,
    @UploadedFile() file: Express.MulterS3.File,
  ) {
    const fileName = file.key.replace(`${S3_PROFILE_PHOTO_DIR}/user-dp/`, '');

    await this.userService.changeDisplayPhoto(user.id, fileName);

    return fileName;
  }

  @Delete('display-photo')
  @ApiOperation({
    summary: 'Delete Display Photo User Zones',
    description: 'Delete user display photo.',
  })
  @ApiOkResponse({
    description: 'Delete user display photo',
  })
  @ApiNotFoundResponse({
    description: 'Error thrown when user display photo is not found.',
    schema: errorResponseDoc(
      404,
      'The specified user has not any display photo!',
      'USER_DISPLAY_PHOTO_NOT_FOUND',
    ),
  })
  @HttpCode(HttpStatus.OK)
  @IsAuthenticated([], { injectUserProfile: true })
  async deleteDisplayPhoto(@CurrentUserProfile() userProfile: UserProfile) {
    if (!userProfile.displayPhoto)
      throw new NotFoundException(
        ErrorTypes.USER_DISPLAY_PHOTO_NOT_FOUND,
        'The specified user has not any display photo!',
      );
    await this.userService.deleteDisplayPhoto(userProfile.id);

    await deleteObject({
      Key: `${S3_PROFILE_PHOTO_DIR}/user-dp/${userProfile.displayPhoto}`,
      Bucket: S3_BUCKET_NAME,
    });
  }

  @Get('display-photo/:fileName')
  @ApiOperation({
    summary: 'Get Display Photo',
    description: 'View display photo of authenticated user.',
  })
  @ApiOkResponse({ description: 'View display photo of authenticated user' })
  @Header('Cache-Control', 'max-age=3600')
  async viewProfilePhoto(
    @Res() res: Response,
    @Param('fileName') fileName: string,
  ) {
    try {
      const creds = {
        Bucket: S3_BUCKET_NAME,
        Key: `${S3_PROFILE_PHOTO_DIR}/user-dp/${fileName}`,
      };
      const head = await s3HeadObject(creds);
      const objectStream = s3.getObject(creds).createReadStream();

      res.setHeader('Content-Disposition', `filename=${fileName}`);
      if (head.ContentType) res.setHeader('Content-Type', head.ContentType);

      return objectStream.pipe(res);
    } catch (err: any) {
      return res.status(err.statusCode || 500).json(err);
    }
  }
}

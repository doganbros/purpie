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
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
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
import { User } from 'entities/User.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PostSettings } from 'types/PostSettings';
import { emptyPaginatedResponse } from 'helpers/utils';
import { UserRole } from 'entities/UserRole.entity';
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
import { UpdateUserPermission } from '../dto/update-permissions.dto';
import { SystemUserListQuery } from '../dto/system-user-list.query';
import { CreateBlockedUserDto } from '../dto/create-blocked-user.dto';
import { UserEvent } from '../listeners/user.event';
import { ErrorTypes } from '../../../types/ErrorTypes';

const { S3_PROFILE_PHOTO_DIR = '', S3_BUCKET_NAME = '' } = process.env;

@Controller({ path: 'user', version: '1' })
@ApiTags('user')
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
  @ApiCreatedResponse({
    description: 'User creates a new contact invitation',
    schema: { type: 'integer' },
  })
  @IsAuthenticated()
  async createNewContactInvitation(
    @CurrentUser() user: UserTokenPayload,
    @Body() { email }: CreateContactDto,
  ) {
    const contactInvitation = await this.userService.createNewContactInvitation(
      email,
      user,
    );

    this.eventEmitter.emit(UserEvent.sendContactRequestNotification, {
      user,
      email,
    });

    return contactInvitation.id;
  }

  @Get('/contact/invitation/list')
  @ApiOkResponse({
    description: 'User lists their contact invitation list',
    type: ContactInvitationListResponse,
  })
  @IsAuthenticated()
  async getContactInvitations(
    @CurrentUser() user: UserTokenPayload,
    @Query() paginatedQuery: PaginationQuery,
  ) {
    const invitations = await this.userService.listContactInvitations(
      user.id,
      paginatedQuery,
    );

    return invitations;
  }

  @Get('invitations/list')
  @ApiOkResponse({
    description: 'User lists all invitations, contacts, channels, zones',
    type: ContactInvitationListResponse,
  })
  @IsAuthenticated()
  async getUserInvitations(
    @CurrentUser() user: UserTokenPayload,
    @Query() paginatedQuery: PaginationQuery,
  ) {
    const invitations = await this.userService.listInvitationsForUser(
      user.id,
      paginatedQuery,
    );

    return invitations;
  }

  @Get('/contact/list')
  @ApiOkResponse({
    description: 'User lists contact',
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
  @ApiOkResponse({
    description: `User lists another's contacts`,
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

  @Get('/blocked/list')
  @IsAuthenticated()
  getBlockedUsers(
    @CurrentUser() user: UserTokenPayload,
    @Query() paginatedQuery: PaginationQuery,
  ) {
    return this.userService.getBlockedUsers(user.id, paginatedQuery);
  }

  @Post('/blocked/create')
  @IsAuthenticated()
  createBlockedUser(
    @Body() info: CreateBlockedUserDto,
    @CurrentUser() user: UserTokenPayload,
  ) {
    return this.userService.createBlockedUser(user.id, info.userId);
  }

  @Delete('/blocked/remove/:userId')
  @IsAuthenticated()
  unblockUser(
    @CurrentUser() user: UserTokenPayload,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.userService.unBlockUser(user.id, userId);
  }

  @Get('/list')
  @ApiOkResponse({
    description: 'User lists system users',
    type: User,
  })
  @IsAuthenticated(['canManageRole'])
  systemUserList(@Query() query: SystemUserListQuery) {
    return this.userService.listSystemUsers(query);
  }

  @Get('/search')
  @IsAuthenticated()
  @ApiQuery({
    name: 'excludeCurrentUser',
    description:
      'Exclude current user in search. Specify false to disable this.',
    type: String,
    required: false,
  })
  async searchUsers(
    @CurrentUser() user: UserTokenPayload,
    @Query() query: SearchUsersQuery,
    @Query('excludeIds')
    excludeIds: Array<string>,
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

  @Get('/role/list')
  @ApiOkResponse({
    type: UserRole,
    description:
      'User lists user roles. User must have canManageRole permission',
  })
  @ValidationBadRequest()
  @IsAuthenticated(['canManageRole'])
  async listUserRoles() {
    return this.userService.listUserRoles();
  }

  @Post('/role/create')
  @ApiCreatedResponse({
    description:
      'User creates a new user role. User must have canManageRole permission',
    schema: { type: 'string', example: 'OK' },
  })
  @ValidationBadRequest()
  @IsAuthenticated(['canManageRole'])
  async createUserRole(@Body() info: UserRole) {
    await this.userService.createUserRole(info);
    return 'OK';
  }

  @Put('/role/change')
  @ApiCreatedResponse({
    description:
      'User changes a role for an existing user. User must have canManageRole permission',
    schema: { type: 'string', example: 'OK' },
  })
  @ValidationBadRequest()
  @IsAuthenticated(['canManageRole'])
  async changeUserRole(@Body() info: SetUserRoleDto) {
    await this.userService.changeUserRole(info);
    return 'OK';
  }

  @Delete('/role/remove/:roleCode')
  @ApiCreatedResponse({
    description:
      'User removes a new user role. User must have canManageRole permission. When a role is removed Created is returned else OK',
    schema: { type: 'string', example: 'OK' },
  })
  @ValidationBadRequest()
  @IsAuthenticated(['canManageRole'])
  async removeUserRole(@Param('roleCode') roleCode: string) {
    const result = await this.userService.removeUserRole(roleCode);
    return result ? 'Created' : 'OK';
  }

  @Put('/permissions/update')
  @ApiCreatedResponse({
    description:
      'User updates permissions for user role. User must have canManageRole permission',
    schema: { type: 'string', example: 'OK' },
  })
  @ValidationBadRequest()
  @IsAuthenticated(['canManageRole'])
  async updateUserRolePermissions(@Body() info: UpdateUserPermission) {
    await this.userService.editUserRolePermissions(info.roleCode, info);
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
    return {
      userName: info.userName,
      exists: !!user,
      suggestions: user
        ? await this.userService.userNameSuggestions(info.userName)
        : [],
    };
  }

  @Get('/zone/list/:userName')
  @IsAuthenticated()
  listPublicUserZones(
    @CurrentUser() user: UserTokenPayload,
    @Param('userName') userName: string,
    @Query() query: PaginationQuery,
  ) {
    return this.userService.getUserZones(user.id, userName, query);
  }

  @Get('/channel/list/:userName')
  @IsAuthenticated()
  listPublicUserChannels(
    @CurrentUser() user: UserTokenPayload,
    @Param('userName') userName: string,
    @Query() query: PaginationQuery,
  ) {
    return this.userService.getUserChannels(user.id, userName, query);
  }

  @Get('profile')
  @IsAuthenticated([], { injectUserProfile: true })
  getUserProfile(@CurrentUserProfile() userProfile: UserProfile) {
    return userProfile;
  }

  @Get('profile/:userName')
  @IsAuthenticated()
  getPublicUserProfile(
    @Param('userName') userName: string,
    @CurrentUser() user: UserTokenPayload,
  ) {
    return this.userService.getPublicUserProfile(user.id, userName);
  }

  @Put('profile')
  @IsAuthenticated()
  async updateUserProfile(
    @CurrentUser() user: UserTokenPayload,
    @Body() info: UpdateProfileDto,
  ) {
    await this.userService.updateProfile(user.id, info);
    return 'OK';
  }

  @Put('display-photo')
  @ApiConsumes('multipart/form-data')
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
  @ApiOkResponse({
    description: 'Delete user display photo',
    schema: { type: 'string', example: 'OK' },
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

  @Get('post-settings')
  @ApiOkResponse({
    type: PostSettings,
    description: 'Retrieves default post settings for a user',
  })
  @IsAuthenticated()
  getCurrentUserPostSettings(@CurrentUser() user: UserTokenPayload) {
    return this.userService.getPostSettings(user.id);
  }

  @Put('post-settings/update')
  @IsAuthenticated()
  updatePostSettings(
    @CurrentUser() user: UserTokenPayload,
    @Body() settings: PostSettings,
  ) {
    return this.userService.updatePostSettings(user.id, settings);
  }

  @Put('featured-post/set/:postId')
  @IsAuthenticated()
  setFeaturedPost(
    @CurrentUser() user: UserTokenPayload,
    @Param('postId', ParseUUIDPipe) postId: string,
  ) {
    return this.userService.setFeaturedPost(user.id, postId);
  }
}

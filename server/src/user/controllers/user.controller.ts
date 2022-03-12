import {
  BadRequestException,
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
import { s3HeadObject, s3Storage, s3 } from 'config/s3-storage';
import {
  UserProfile,
  UserTokenPayload,
} from 'src/auth/interfaces/user.interface';
import { ValidationBadRequest } from 'src/utils/decorators/validation-bad-request.decorator';
import { User } from 'entities/User.entity';
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

const { S3_PROFILE_PHOTO_DIR = '', S3_VIDEO_BUCKET_NAME = '' } = process.env;

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
    @CurrentUser() user: UserTokenPayload,
    @Body() { contactInvitationId, status }: ContactInvitationResponseDto,
  ) {
    const invitation = await this.userService.getContactInvitationByIdAndInviteeId(
      contactInvitationId,
      user.id,
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
    @CurrentUser() user: UserTokenPayload,
    @Body() { userId }: CreateContactDto,
  ) {
    const contactInvitation = await this.userService.createNewContactInvitation(
      user.id,
      userId,
    );

    return contactInvitation.id;
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
        user.id,
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
  @IsAuthenticated()
  async getContactInvitations(
    @CurrentUser() user: UserTokenPayload,
    @Query() paginatedQuery: PaginationQuery,
  ) {
    const contactInvitation = await this.userService.listContactInvitations(
      user.id,
      paginatedQuery,
    );

    return contactInvitation;
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
    return this.userService.listContacts(user.id, paginatedQuery);
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

  @Get('profile')
  @IsAuthenticated([], { injectUserProfile: true })
  getUserProfile(@CurrentUserProfile() userProfile: UserProfile) {
    return userProfile;
  }

  @Get('profile/:userName')
  @IsAuthenticated()
  getPublicUserProfile(@Param('userName') userName: string) {
    return this.userService.getPublicUserProfile(userName);
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
              'Please upload a valid photo format',
              'FILE_FORMAT_MUST_BE_PHOTO',
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

  @Get('display-photo/:fileName')
  async viewProfilePhoto(
    @Res() res: Response,
    @Param('fileName') fileName: string,
  ) {
    try {
      const creds = {
        Bucket: S3_VIDEO_BUCKET_NAME,
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

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
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UserZone } from 'entities/UserZone.entity';
import { Express, Response } from 'express';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import {
  CurrentUser,
  CurrentUserMembership,
  CurrentUserProfile,
} from 'src/auth/decorators/current-user.decorator';
import { User } from 'entities/User.entity';
import { SearchQuery } from 'types/SearchQuery';
import { FileInterceptor } from '@nestjs/platform-express';
import { s3, s3HeadObject, s3Storage } from 'config/s3-storage';
import { ValidationBadRequest } from 'src/utils/decorators/validation-bad-request.decorator';
import { errorResponseDoc } from 'helpers/error-response-doc';
import { SystemUserListQuery } from 'src/user/dto/system-user-list.query';
import {
  UserMembership,
  UserProfile,
  UserTokenPayload,
} from 'src/auth/interfaces/user.interface';
import { CurrentUserZone } from '../decorators/current-user-zone.decorator';
import { UserZoneRole } from '../decorators/user-zone-role.decorator';
import { InviteToJoinDto } from '../dto/invite-to-join.dto';
import { InvitationResponseDto } from '../dto/invitation-response.dto';
import { ZoneIdParams } from '../dto/zone-id.params';
import { ZoneService } from '../services/zone.service';
import { EditZoneDto } from '../dto/edit-zone.dto';
import { CreateZoneDto } from '../dto/create-zone.dto';
import { UpdateUserZoneRoleDto } from '../dto/update-user-zone-role.dto';
import { UpdateZonePermission } from '../dto/update-zone-permission.dto';
import { UserZoneService } from '../services/user-zone.service';
import { ErrorTypes } from '../../../types/ErrorTypes';
import { ZoneRoleCode } from '../../../types/RoleCodes';
import { ZoneUserResponse } from '../responses/zone-user.response';
import { SearchZoneResponse } from '../responses/search-zone.response';
import { UserZoneRoleResponse } from '../responses/user-zone.response';

const {
  S3_PROFILE_PHOTO_DIR = '',
  S3_BUCKET_NAME = '',
  NODE_ENV,
} = process.env;

@Controller({ version: '1', path: 'zone' })
@ApiTags('Zone')
export class ZoneController {
  constructor(
    private zoneService: ZoneService,
    private userZoneService: UserZoneService,
  ) {}

  @Post('create')
  @ApiCreatedResponse({
    description:
      'Current authenticated user adds a new zone. The id of the user zone is returned. User zone must have canCreateZone permission',
    schema: { type: 'integer' },
  })
  @ApiForbiddenResponse({
    description:
      'Error thrown when current user membership zone creation limit is full',
    schema: errorResponseDoc(
      403,
      'Your channel zone operation failed due to insufficient membership.',
      ErrorTypes.INSUFFICIENT_MEMBERSHIP,
    ),
  })
  @ApiBadRequestResponse({
    description: 'Error thrown when new zone subdomain is not unique.',
    schema: errorResponseDoc(
      403,
      'The zone with requested subdomain already exist.',
      ErrorTypes.ZONE_SUBDOMAIN_ALREADY_EXIST,
    ),
  })
  @ValidationBadRequest()
  @IsAuthenticated(['canCreateZone'], {
    injectUserProfile: true,
    injectUserMembership: true,
  })
  async createZone(
    @Body() createZoneInfo: CreateZoneDto,
    @CurrentUserProfile() userProfile: UserProfile,
    @CurrentUserMembership() userMembership: UserMembership,
  ) {
    if (NODE_ENV !== 'development')
      await this.zoneService.validateCreateZone(
        userProfile.id,
        userMembership.zoneCount,
      );

    const userZone = await this.zoneService.createZone(
      userProfile.id,
      createZoneInfo,
    );

    this.zoneService.sendZoneInfoMail(userZone.zone, userProfile);

    return userZone.id;
  }

  @Put('/update/:zoneId')
  @ApiCreatedResponse({
    description:
      'User updates a zone. User must have the canEdit permission on zone',
    schema: { type: 'string', example: 'OK' },
  })
  @ApiParam({
    name: 'zoneId',
    description: 'The zone id',
  })
  @UserZoneRole(['canEdit'])
  async editZone(
    @CurrentUserZone() userZone: UserZone,
    @Body() editInfo: EditZoneDto,
  ) {
    await this.zoneService.editZoneById(userZone.zone.id, editInfo);
    return 'OK';
  }

  @Delete('/remove/:zoneId')
  @ApiOkResponse({
    description:
      'User deletes a zone. User must have the canDelete permission on zone.',
    schema: { type: 'string', example: 'OK' },
  })
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'zoneId',
    description: 'The zone id',
  })
  @UserZoneRole(['canDelete'])
  async deleteZone(@CurrentUserZone() userZone: UserZone) {
    await this.zoneService.deleteZoneById(userZone.zone.id);
    return 'OK';
  }

  @Get('/search')
  @ApiOkResponse({
    description: 'Search zone with requested search term field.',
    type: SearchZoneResponse,
  })
  @IsAuthenticated()
  searchZone(
    @Query() query: SearchQuery,
    @CurrentUser() user: UserTokenPayload,
  ) {
    return this.zoneService.searchZone(user.id, query);
  }

  @Get('/users/list/:zoneId')
  @ApiOkResponse({
    description: 'Lists zone users according to requested zone id.',
    type: ZoneUserResponse,
  })
  @UserZoneRole(['canManageRole'])
  zoneUserList(
    @Query() query: SystemUserListQuery,
    @Param('zoneId', ParseUUIDPipe) zoneId: string,
  ) {
    return this.zoneService.listZoneUsers(zoneId, query);
  }

  @Post('/join/:zoneId')
  @ApiCreatedResponse({
    description:
      'Current authenticated user joins a public zone. The id of the user zone is returned',
    schema: { type: 'integer' },
  })
  @ApiNotFoundResponse({
    description: 'Error thrown when the zone is not found',
    schema: errorResponseDoc(404, 'Zone not found', 'ZONE_NOT_FOUND'),
  })
  @IsAuthenticated([], { injectUserProfile: true })
  async joinPublicZone(
    @CurrentUserProfile() user: UserProfile,
    @Param() { zoneId }: ZoneIdParams,
  ) {
    const zone = await this.zoneService.validateJoinPublicZone(user.id, zoneId);

    if (!zone)
      throw new NotFoundException(ErrorTypes.ZONE_NOT_FOUND, 'Zone not found');

    const userZone = await this.userZoneService.addUserToZone(user.id, zoneId);

    await this.zoneService.removeInvitation(user.email, zone.id);
    return userZone.id;
  }

  @Post('/invite/:zoneId')
  @UserZoneRole(['canInvite'])
  @ApiCreatedResponse({
    description:
      'Current authenticated invites a user to this zone. The id of the invitation is returned. User must have canInvite permission on zone permissions.',
    schema: { type: 'integer' },
  })
  @ApiNotFoundResponse({
    description:
      'Error thrown when the user is not eligible for the zone or the zone is not found',
    schema: errorResponseDoc(404, 'Zone not found', 'ZONE_NOT_FOUND'),
  })
  @ApiBadRequestResponse({
    description: 'Error thrown when the user is already invited',
    schema: errorResponseDoc(
      400,
      `The user with the email '<email>' has already been invited to this zone`,
      'USER_ALREADY_INVITED_TO_ZONE',
    ),
  })
  @ApiConflictResponse({
    description: 'Error thrown when the user is already member of this zone',
    schema: errorResponseDoc(
      409,
      `The user with the email '<email>' has already a member of this zone`,
      'USER_ALREADY_MEMBER_OF_ZONE',
    ),
  })
  @ValidationBadRequest()
  async inviteToJoinZone(
    @Param() { zoneId }: ZoneIdParams,
    @Body() { email }: InviteToJoinDto,
    @CurrentUserZone() currentUserZone: UserZone,
    @CurrentUser() user: User,
  ) {
    await this.zoneService.validateInviteUser(email, zoneId);

    const invitation = await this.zoneService.addUserToZoneInvitation(
      email,
      zoneId,
      user.id,
    );

    this.zoneService.sendZoneInvitationMail(currentUserZone.zone, email);

    return invitation;
  }

  @Post('/invitation/response')
  @IsAuthenticated([], { injectUserProfile: true })
  @ApiCreatedResponse({
    description: 'User Responds to invitation',
    schema: { type: 'string', example: 'OK' },
  })
  @ApiNotFoundResponse({
    description: 'Error thrown when the requested invitation is not found.',
    schema: errorResponseDoc(
      404,
      'Invitation not found',
      'INVITATION_NOT_FOUND',
    ),
  })
  @ValidationBadRequest()
  async respondToInvitationToJoinZone(
    @Body() invitationResponse: InvitationResponseDto,
    @CurrentUserProfile() userProfile: UserProfile,
  ) {
    const invitation = await this.zoneService.validateInvitationResponse(
      invitationResponse.invitationId,
      userProfile.email,
    );

    if (!invitation)
      throw new NotFoundException(
        ErrorTypes.INVITATION_NOT_FOUND,
        'Invitation not found',
      );

    if (invitationResponse.status === 'reject') {
      await invitation.remove();
      return 'OK';
    }

    await this.userZoneService.addUserToZone(userProfile.id, invitation.zoneId);

    await invitation.remove();
    return 'OK';
  }

  @Put('/:userZoneId/display-photo')
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'userZoneId',
    description: 'Alternatively you can use zoneId',
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
      storage: s3Storage(`${S3_PROFILE_PHOTO_DIR}/zone-dp/`),
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
  @UserZoneRole(['canEdit'])
  @ValidationBadRequest()
  async changeDisplayPhoto(
    @CurrentUserZone() userZone: UserZone,
    @UploadedFile() file: Express.MulterS3.File,
  ) {
    const fileName = file.key.replace(`${S3_PROFILE_PHOTO_DIR}/zone-dp/`, '');

    await this.zoneService.changeDisplayPhoto(userZone.zone.id, fileName);

    return fileName;
  }

  @Get('display-photo/:fileName')
  @ApiOkResponse({ description: 'Get display photo of selected zone' })
  @Header('Cache-Control', 'max-age=3600')
  async viewProfilePhoto(
    @Res() res: Response,
    @Param('fileName') fileName: string,
  ) {
    try {
      const creds = {
        Bucket: S3_BUCKET_NAME,
        Key: `${S3_PROFILE_PHOTO_DIR}/zone-dp/${fileName}`,
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

  @Get('/role/list/:zoneId')
  @ApiOkResponse({
    type: UserZoneRoleResponse,
    isArray: true,
    description:
      'User lists all zone roles. User must have canManageRole permission',
  })
  @ApiParam({
    name: 'zoneId',
    description: 'The zone id',
  })
  @ValidationBadRequest()
  @UserZoneRole(['canManageRole'])
  listZoneRoles(@Param('zoneId', ParseUUIDPipe) zoneId: string) {
    return this.zoneService.listZoneRoles(zoneId);
  }

  @Put('/role/change/:zoneId')
  @ApiCreatedResponse({
    description:
      'User changes a role for an existing user zone. User must have canManageRole permission',
    schema: { type: 'string', example: 'OK' },
  })
  @ApiForbiddenResponse({
    description: 'Error thrown when the specified zone has not any owner',
    schema: errorResponseDoc(
      404,
      'There must be at least one owner of zone.',
      'OWNER_NOT_EXIST',
    ),
  })
  @ValidationBadRequest()
  @UserZoneRole(['canManageRole'])
  async changeUserZoneRole(
    @Body() info: UpdateUserZoneRoleDto,
    @Param('zoneId', ParseUUIDPipe) zoneId: string,
  ) {
    await this.zoneService.changeUserZoneRole(zoneId, info);
    return 'OK';
  }

  @Delete('/role/remove/:zoneId/:roleCode')
  @ApiParam({
    name: 'zoneId',
    description: 'The zone id',
  })
  @ApiCreatedResponse({
    description:
      'User removes a new zone role. User must have canManageRole permission. When a role is removed Created is returned else OK',
    schema: { type: 'string', example: 'OK' },
  })
  @ApiForbiddenResponse({
    description:
      'Error thrown when the requested zone role already used for some users.',
    schema: errorResponseDoc(
      404,
      'Users using this role already exists',
      'USER_ROLE_EXIST',
    ),
  })
  @ValidationBadRequest()
  @UserZoneRole(['canManageRole'])
  async removeChannelRole(
    @Param('roleCode') roleCode: ZoneRoleCode,
    @Param('zoneId', ParseUUIDPipe) zoneId: string,
  ) {
    const result = await this.zoneService.removeZoneRole(zoneId, roleCode);
    return result ? 'Created' : 'OK';
  }

  @Put('/permissions/update/:zoneId')
  @ApiParam({
    name: 'zoneId',
    description: 'The zone id',
  })
  @ApiCreatedResponse({
    description:
      'User updates permissions for user role. User must have canManageRole permission',
    schema: { type: 'string', example: 'OK' },
  })
  @ApiForbiddenResponse({
    description: 'Error thrown when the the request is changed to owner role.',
    schema: errorResponseDoc(
      404,
      "Zone Owner Permissions can't be changed",
      'CHANGE_OWNER_PERMISSION',
    ),
  })
  @ValidationBadRequest()
  @UserZoneRole(['canManageRole'])
  async updateUserRolePermissions(
    @Body() info: UpdateZonePermission,
    @Param('zoneId', ParseUUIDPipe) zoneId: string,
  ) {
    await this.zoneService.editZoneRolePermissions(zoneId, info.roleCode, info);
    return 'OK';
  }
}

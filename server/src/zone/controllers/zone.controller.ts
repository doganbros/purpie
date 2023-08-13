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
  ApiConsumes,
  ApiCreatedResponse,
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
import { ZoneRole } from 'entities/ZoneRole.entity';
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

const { S3_PROFILE_PHOTO_DIR = '', S3_BUCKET_NAME = '' } = process.env;
@Controller({ version: '1', path: 'zone' })
@ApiTags('zone')
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

  @Get('/users/list/:zoneId')
  @ApiOkResponse({
    description: 'User lists zone users',
    type: User,
  })
  @UserZoneRole(['canManageRole'])
  zoneUserList(
    @Query() query: SystemUserListQuery,
    @Param('zoneId', ParseUUIDPipe) zoneId: string,
  ) {
    return this.zoneService.listZoneUsers(zoneId, query);
  }

  @Get('/search')
  @IsAuthenticated()
  searchChannel(
    @Query() query: SearchQuery,
    @CurrentUser() user: UserTokenPayload,
  ) {
    return this.zoneService.searchZone(user.id, query);
  }

  @Post('/join/:zoneId')
  @ApiCreatedResponse({
    description:
      'Current authenticated user joins a public zone. The id of the user zone is returned',
    schema: { type: 'integer' },
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

    this.zoneService.removeInvitation(user.email, zone.id);
    return userZone.id;
  }

  @Post('/invite/:zoneId')
  @UserZoneRole(['canInvite'])
  @ApiCreatedResponse({
    description:
      'Current authenticated invites a user to this zone. The id of the invitation is returned. UserZone must have canInvite permission',
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
      invitation.remove();
      return 'OK';
    }

    await this.userZoneService.addUserToZone(userProfile.id, invitation.zoneId);

    await invitation.remove();
    return 'OK';
  }

  @Delete('/remove/:zoneId')
  @ApiOkResponse({
    description:
      'User deletes a zone. UserZone must have the canDelete permission',
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

  @Put('/update/:zoneId')
  @ApiCreatedResponse({
    description:
      'User updates a zone. UserZone must have the canEdit permission',
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

  @Put('/:userZoneId/display-photo')
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'userZoneId',
    description: 'Alternatively you can use zoneId',
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
    type: ZoneRole,
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

  @Post('/role/create/:zoneId')
  @ApiCreatedResponse({
    description:
      'User creates a new zone role. User must have canManageRole permission',
    schema: { type: 'string', example: 'OK' },
  })
  @ValidationBadRequest()
  @UserZoneRole(['canManageRole'])
  async createZoneRole(
    @Body() info: ZoneRole,
    @Param('zoneId', ParseUUIDPipe) zoneId: string,
  ) {
    await this.zoneService.createZoneRole(zoneId, info);
    return 'OK';
  }

  @Put('/role/change/:zoneId')
  @ApiCreatedResponse({
    description:
      'User changes a role for an existing user zone. User must have canManageRole permission',
    schema: { type: 'string', example: 'OK' },
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

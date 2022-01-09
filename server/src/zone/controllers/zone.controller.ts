import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
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
  CurrentUserProfile,
} from 'src/auth/decorators/current-user.decorator';
import { User } from 'entities/User.entity';
import { SearchQuery } from 'types/SearchQuery';
import { Category } from 'entities/Category.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { s3, s3HeadObject, s3Storage } from 'config/s3-storage';
import { ValidationBadRequest } from 'src/utils/decorators/validation-bad-request.decorator';
import { errorResponseDoc } from 'helpers/error-response-doc';
import {
  UserProfile,
  UserTokenPayload,
} from 'src/auth/interfaces/user.interface';
import { CurrentUserZone } from '../decorators/current-user-zone.decorator';
import { UserZoneRole } from '../decorators/user-zone-role.decorator';
import { InviteToJoinDto } from '../dto/invite-to-join.dto';
import { InvitationResponseDto } from '../dto/invitation-response.dto';
import { ZoneIdParams } from '../dto/zone-id.params';
import { ZoneService } from '../zone.service';
import { EditZoneDto } from '../dto/edit-zone.dto';
import { CreateZoneDto } from '../dto/create-zone.dto';

const { S3_PROFILE_PHOTO_DIR = '', S3_VIDEO_BUCKET_NAME = '' } = process.env;
@Controller({ version: '1', path: 'zone' })
@ApiTags('zone')
export class ZoneController {
  constructor(private zoneService: ZoneService) {}

  @Post('create')
  @ApiCreatedResponse({
    description:
      'Current authenticated user adds a new zone. The id of the user zone is returned. User zone must have canCreateZone permission',
    schema: { type: 'integer' },
  })
  @ValidationBadRequest()
  @IsAuthenticated(['canCreateZone'], { injectUserProfile: true })
  async createZone(
    @Body() createZoneInfo: CreateZoneDto,
    @CurrentUserProfile() userProfile: UserProfile,
  ) {
    const userZone = await this.zoneService.createZone(
      userProfile.id,
      createZoneInfo,
    );

    this.zoneService.sendZoneInfoMail(userZone.zone, userProfile);

    return userZone.id;
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

    if (!zone) throw new NotFoundException('Zone not found', 'ZONE_NOT_FOUND');

    const userZone = await this.zoneService.addUserToZone(user.id, zoneId);

    this.zoneService.removeInvitation(user.email, zone.id);
    return userZone.id;
  }

  @Get('/categories/list')
  @ApiOkResponse({
    type: Category,
    isArray: true,
    description:
      'Current authenticated lists categories eligible for zones. These are the categories presented while creating a zone',
  })
  async getParentCategories() {
    return this.zoneService.getCategories();
  }

  @Get('/categories/list/:zoneId')
  @ApiParam({
    name: 'zoneId',
    description: 'The zone id',
  })
  @ApiOkResponse({
    type: Category,
    isArray: true,
    description:
      'Current authenticated lists categories eligible for a channel under the passed zoneId. These are the categories presented while creating a channel',
  })
  @UserZoneRole()
  async getZoneCategories(@CurrentUserZone() currentUserZone: UserZone) {
    return this.zoneService.getCategories(currentUserZone.zone.categoryId);
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
    const zone = await this.zoneService.validateInviteUser(email, zoneId);

    if (!zone) throw new NotFoundException('Zone not found', 'ZONE_NOT_FOUND');

    const invitation = await this.zoneService.addUserToZoneInvitation(
      email,
      zoneId,
      user.id,
    );

    this.zoneService.sendZoneInvitationMail(currentUserZone.zone, email);

    return invitation.id;
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

    if (!invitation) throw new NotFoundException('Invitation not found');

    if (invitationResponse.status === 'reject') {
      invitation.remove();
      return 'OK';
    }

    await this.zoneService.addUserToZone(userProfile.id, invitation.zoneId);

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
  @IsAuthenticated()
  async viewProfilePhoto(
    @Res() res: Response,
    @Param('fileName') fileName: string,
  ) {
    try {
      const creds = {
        Bucket: S3_VIDEO_BUCKET_NAME,
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
}

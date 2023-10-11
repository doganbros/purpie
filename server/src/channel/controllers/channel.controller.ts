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
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { s3, s3HeadObject, s3Storage } from 'config/s3-storage';
import { Express, Response } from 'express';
import { User } from 'entities/User.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { UserZone } from 'entities/UserZone.entity';
import { errorResponseDoc } from 'helpers/error-response-doc';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import {
  CurrentUser,
  CurrentUserMembership,
  CurrentUserProfile,
} from 'src/auth/decorators/current-user.decorator';
import {
  UserMembership,
  UserProfile,
  UserTokenPayload,
} from 'src/auth/interfaces/user.interface';
import { ValidationBadRequest } from 'src/utils/decorators/validation-bad-request.decorator';
import { SystemUserListQuery } from 'src/user/dto/system-user-list.query';
import { CurrentUserZone } from 'src/zone/decorators/current-user-zone.decorator';
import { UserZoneRole } from 'src/zone/decorators/user-zone-role.decorator';
import { UserZoneService } from 'src/zone/services/user-zone.service';
import { ChannelRole } from 'entities/ChannelRole.entity';
import { InvitationResponseDto } from 'src/zone/dto/invitation-response.dto';
import { ChannelService } from '../services/channel.service';
import { CurrentUserChannel } from '../decorators/current-user-channel.decorator';
import { UserChannelRole } from '../decorators/user-channel-role.decorator';
import { CreateChannelDto } from '../dto/create-channel.dto';
import { EditChannelDto } from '../dto/edit-channel.dto';
import { InviteToJoinChannelDto } from '../dto/invite-to-join-channel.dto';
import { SearchChannelQuery } from '../dto/search-channel.query';
import { UpdateChannelUserRoleDto } from '../dto/update-channel-user-role.dto';
import { UpdateChannelPermission } from '../dto/update-channel-permission.dto';
import { ErrorTypes } from '../../../types/ErrorTypes';
import { ChannelSearchResponse } from '../responses/channel-search.response';
import { ChannelUserResponse } from '../responses/channel-user.response';

const {
  S3_PROFILE_PHOTO_DIR = '',
  S3_BUCKET_NAME = '',
  NODE_ENV,
} = process.env;

@Controller({ path: 'channel', version: '1' })
@ApiTags('Channel')
export class ChannelController {
  constructor(
    private channelService: ChannelService,
    private userZoneService: UserZoneService,
  ) {}

  @Post('/create/:userZoneId')
  @ApiCreatedResponse({
    description:
      'Current authenticated user adds a new channel to a zone. User channel id is returned. User channel must have canCreateChannel permission',
    schema: { type: 'string' },
  })
  @ValidationBadRequest()
  @ApiParam({
    name: 'userZoneId',
    description: 'User zone id',
  })
  @ApiBadRequestResponse({
    description:
      'Error thrown when user membership is insufficient to create new channel.',
    schema: errorResponseDoc(
      400,
      'Your channel create operation failed due to insufficient membership.',
      ErrorTypes.INSUFFICIENT_MEMBERSHIP,
    ),
  })
  @UserZoneRole(
    ['canCreateChannel'],
    [],
    {},
    { injectUserProfile: true, injectUserMembership: true },
  )
  async createNewChannel(
    @Body() createChannelInfo: CreateChannelDto,
    @CurrentUserProfile() userProfile: UserProfile,
    @CurrentUserMembership() userMembership: UserMembership,
    @CurrentUserZone() currentUserZone: UserZone,
  ) {
    if (NODE_ENV !== 'development')
      await this.channelService.validateCreateChannel(
        userProfile.id,
        userMembership.channelCount,
      );

    const userChannel = await this.channelService.createChannel(
      userProfile.id,
      currentUserZone.id,
      currentUserZone.zone.id,
      createChannelInfo,
    );

    this.channelService.sendChannelInfo(
      currentUserZone.zone,
      userChannel.channel,
      userProfile,
    );

    return userChannel.id;
  }

  @Get('/search')
  @ApiOkResponse({
    description: 'Search channels with requested search term',
    type: ChannelSearchResponse,
  })
  @IsAuthenticated()
  searchChannel(
    @Query() query: SearchChannelQuery,
    @CurrentUser() user: UserTokenPayload,
  ) {
    return this.channelService.searchChannel(user, query);
  }

  @Post('/join/:channelId')
  @ApiCreatedResponse({
    description:
      "Current authenticated user joins a public channel. When the user doesn't belong to the zone he/she is added to that zone. The id of the user channel is returned",
  })
  @ApiNotFoundResponse({
    description: 'Error thrown when the joined channel is not found',
    schema: errorResponseDoc(404, 'Channel not found', 'CHANNEL_NOT_FOUND'),
  })
  @IsAuthenticated([], { injectUserProfile: true })
  async joinPublicChannel(
    @CurrentUserProfile() userProfile: UserProfile,
    @Param('channelId', ParseUUIDPipe) channelId: string,
  ) {
    const channel = await this.channelService.validateJoinPublicChannel(
      userProfile.id,
      channelId,
    );

    if (!channel)
      throw new NotFoundException(
        ErrorTypes.CHANNEL_NOT_FOUND,
        'Channel not found',
      );

    let userZone = await this.userZoneService.userExistsInZone(
      userProfile.id,
      channel.zoneId,
    );

    if (!userZone)
      userZone = await this.userZoneService.addUserToZone(
        userProfile.id,
        channel.zoneId,
      );

    await this.channelService.addUserToChannel(
      userProfile.id,
      userZone.id,
      channel.id,
    );
    await this.channelService.removeInvitation(userProfile.email, channel.id);
  }

  @Post('/invite/:channelId')
  @UserChannelRole(['canInvite'])
  @ApiCreatedResponse({
    description:
      'Current authenticated channel member invites a user to this channel. The id of the invitation is returned. User channel must have canInvite permission',
    schema: { type: 'integer' },
  })
  @ApiNotFoundResponse({
    description:
      'Error thrown when the user is not eligible for the channel or the channel is not found',
    schema: errorResponseDoc(404, 'Channel not found', 'CHANNEL_NOT_FOUND'),
  })
  @ApiBadRequestResponse({
    description: 'Error thrown when the user is already invited',
    schema: errorResponseDoc(
      400,
      `The user with the email '<email>' has already been invited to this channel`,
      'USER_ALREADY_INVITED_TO_CHANNEL',
    ),
  })
  @ValidationBadRequest()
  async inviteToJoinChannel(
    @Param('channelId', ParseUUIDPipe) channelId: string,
    @Body() { email }: InviteToJoinChannelDto,
    @CurrentUserChannel() currentUserChannel: UserChannel,
    @CurrentUser() currentUser: User,
  ) {
    await this.channelService.validateInviteUser(email, channelId);

    const invitation = await this.channelService.addUserToChannelInvitation(
      email,
      channelId,
      currentUser.id,
    );

    this.channelService.sendChannelInvitationMail(
      currentUserChannel.channel,
      email,
    );

    return invitation;
  }

  @Post('/invitation/response')
  @ValidationBadRequest()
  @ApiNotFoundResponse({
    description: 'Error thrown when the invitation is not found',
    schema: errorResponseDoc(
      404,
      'Invitation not found',
      'INVITATION_NOT_FOUND',
    ),
  })
  @ApiCreatedResponse({
    description: 'User Responds to invitation',
    schema: { type: 'string', example: 'OK' },
  })
  @IsAuthenticated([], { injectUserProfile: true })
  async respondToInvitationToJoinChannel(
    @Body() invitationResponse: InvitationResponseDto,
    @CurrentUserProfile() userProfile: UserProfile,
  ) {
    const invitation = await this.channelService.validateInvitationResponse(
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

    let userZone = await this.userZoneService.userExistsInZone(
      userProfile.id,
      invitation.channel.zoneId,
    );

    if (!userZone)
      userZone = await this.userZoneService.addUserToZone(
        userProfile.id,
        invitation.channel.zoneId,
      );

    await this.channelService.addUserToChannel(
      userProfile.id,
      userZone.id,
      invitation.channelId,
    );

    await invitation.remove();
    return 'OK';
  }

  @Delete('/remove/:channelId')
  @ApiParam({
    name: 'channelId',
    description: 'The channel id',
  })
  @ApiOkResponse({
    description:
      'User deletes a channel. User channel must have the canDelete permission',
  })
  @HttpCode(HttpStatus.OK)
  @UserChannelRole(['canDelete'])
  async deleteZone(@CurrentUserChannel() userChannel: UserChannel) {
    await this.channelService.deleteByChannelId(userChannel.channel.id);
  }

  @Put('/update/:channelId')
  @ApiCreatedResponse({
    description:
      'User updates a zone. User channel must have the canEdit permission',
  })
  @ApiParam({
    name: 'channelId',
    description: 'The channel id',
  })
  @UserChannelRole(['canEdit'])
  async editChannel(
    @CurrentUserChannel() userChannel: UserChannel,
    @Body() editInfo: EditChannelDto,
  ) {
    await this.channelService.editChannelById(userChannel.channel.id, editInfo);
  }

  @Get('/users/list/:channelId')
  @ApiOkResponse({
    description: 'User lists channel users',
    type: ChannelUserResponse,
  })
  channelUserList(
    @Query() query: SystemUserListQuery,
    @Param('channelId', ParseUUIDPipe) channelId: string,
  ) {
    return this.channelService.listChannelUsers(channelId, query);
  }

  @Get('/role/list/:channelId')
  @ApiOkResponse({
    type: ChannelRole,
    description:
      'User lists all channel roles. User must have canManageRole permission',
  })
  @ValidationBadRequest()
  @UserChannelRole(['canManageRole'])
  listChannelRoles(@Param('channelId', ParseUUIDPipe) channelId: string) {
    return this.channelService.listChannelRoles(channelId);
  }

  @Put('/role/change/:channelId')
  @ApiCreatedResponse({
    description:
      'User changes a role for an existing user channel. User must have canManageRole permission',
    schema: { type: 'string', example: 'OK' },
  })
  @ApiForbiddenResponse({
    description: 'Error thrown when the specified channel has not any owner',
    schema: errorResponseDoc(
      404,
      'There must be at least one channel owner.',
      'OWNER_NOT_EXIST',
    ),
  })
  @ValidationBadRequest()
  @UserChannelRole(['canManageRole'])
  async changeUserChannelRole(
    @Body() info: UpdateChannelUserRoleDto,
    @Param('channelId', ParseUUIDPipe) channelId: string,
  ) {
    await this.channelService.changeUserChannelRole(channelId, info);
    return 'OK';
  }

  @Put('/permissions/update/:channelId')
  @ApiCreatedResponse({
    description:
      'User updates permissions for user role. User must have canManageRole permission',
    schema: { type: 'string', example: 'OK' },
  })
  @ApiForbiddenResponse({
    description: 'Error thrown when the the request is changed to owner role.',
    schema: errorResponseDoc(
      404,
      "Channel Owner Permissions can't be changed",
      'CHANGE_OWNER_PERMISSION',
    ),
  })
  @ValidationBadRequest()
  @UserChannelRole(['canManageRole'])
  async updateUserRolePermissions(
    @Body() info: UpdateChannelPermission,
    @Param('channelId', ParseUUIDPipe) channelId: string,
  ) {
    await this.channelService.editChannelRolePermissions(
      channelId,
      info.roleCode,
      info,
    );
    return 'OK';
  }

  @Put('/:userChannelId/display-photo')
  @ApiConsumes('multipart/form-data')
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
      storage: s3Storage(`${S3_PROFILE_PHOTO_DIR}/channel-dp/`),
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
  @UserChannelRole(['canEdit'])
  @ValidationBadRequest()
  async changeDisplayPhoto(
    @CurrentUserChannel() userChannel: UserChannel,
    @UploadedFile() file: Express.MulterS3.File,
    @Param('userChannelId', ParseUUIDPipe) userChannelId: string,
  ) {
    const fileName = file.key.replace(
      `${S3_PROFILE_PHOTO_DIR}/channel-dp/`,
      '',
    );

    await this.channelService.changeDisplayPhoto(userChannelId, fileName);

    return fileName;
  }

  @Get('display-photo/:fileName')
  @ApiOkResponse({ description: 'Get display photo of selected channel' })
  @Header('Cache-Control', 'max-age=3600')
  async viewProfilePhoto(
    @Res() res: Response,
    @Param('fileName') fileName: string,
  ) {
    try {
      const creds = {
        Bucket: S3_BUCKET_NAME,
        Key: `${S3_PROFILE_PHOTO_DIR}/channel-dp/${fileName}`,
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

  @Put('/:userChannelId/background-photo')
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
      storage: s3Storage(`${S3_PROFILE_PHOTO_DIR}/channel-bg/`),
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
  @ApiBadRequestResponse({
    description:
      'Error thrown when the requested photo format invalid. Valid formats: jpg, jpeg, png, bmp and svg',
    schema: errorResponseDoc(
      400,
      'Please upload a valid photo format',
      'INVALID_IMAGE_FORMAT',
    ),
  })
  @UserChannelRole(['canEdit'])
  @ValidationBadRequest()
  async changeBackgroundPhoto(
    @CurrentUserChannel() userChannel: UserChannel,
    @UploadedFile() file: Express.MulterS3.File,
  ) {
    const fileName = file.key.replace(
      `${S3_PROFILE_PHOTO_DIR}/channel-bg/`,
      '',
    );
    await this.channelService.changeBackgroundPhoto(
      userChannel.channel.id,
      fileName,
    );

    return fileName;
  }

  @Get('background-photo/:fileName')
  @Header('Cache-Control', 'max-age=3600')
  @ApiOkResponse({ description: 'Get background photo of selected channel' })
  async viewBackgroundPhoto(
    @Res() res: Response,
    @Param('fileName') fileName: string,
  ) {
    try {
      const creds = {
        Bucket: S3_BUCKET_NAME,
        Key: `${S3_PROFILE_PHOTO_DIR}/channel-bg/${fileName}`,
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

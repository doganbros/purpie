import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Post as PostEntity } from 'entities/Post.entity';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import {
  CurrentUser,
  CurrentUserMembership,
  CurrentUserProfile,
} from 'src/auth/decorators/current-user.decorator';
import {
  ConferenceUser,
  UserMembership,
  UserProfile,
  UserTokenPayload,
} from 'src/auth/interfaces/user.interface';
import { PaginationQuery } from 'types/PaginationQuery';
import { MeetingEvent } from 'types/MeetingEvent';
import { MeetingConfig } from 'types/Meeting';
import { errorResponseDoc } from 'helpers/error-response-doc';
import { ValidationBadRequest } from 'src/utils/decorators/validation-bad-request.decorator';
import { IsClientAuthenticated } from 'src/auth/decorators/client-auth.decorator';
import { IsConferenceUserAuthenticated } from 'src/auth/decorators/conference-auth.decorator';
import { CurrentConferenceUser } from 'src/auth/decorators/current-conference-user.decorator';
import { ConferenceRoomName } from 'src/auth/decorators/conference-room-name.decorator';
import { CreateMeetingDto } from '../dto/create-meeting.dto';
import { MeetingService } from '../services/meeting.service';
import { ClientVerifyMeetingAuthDto } from '../dto/client-verify-meeting-auth.dto';
import { ConferenceInfoResponse } from '../responses/conference-info.response';
import { User } from '../../../entities/User.entity';
import { PostReaction } from '../../../entities/PostReaction.entity';
import { UserChannel } from '../../../entities/UserChannel.entity';
import { defaultPostSettings } from '../../../entities/data/default-post-settings';
import { defaultPrivacyConfig } from '../../../entities/data/default-privacy-config';
import { ErrorTypes } from '../../../types/ErrorTypes';

dayjs.extend(utc);
dayjs.extend(timezone);

@Controller({ path: 'meeting', version: '1' })
@ApiTags('Meeting')
export class MeetingController {
  constructor(private meetingService: MeetingService) {}

  @Post('create')
  @IsAuthenticated([], { injectUserProfile: true, injectUserMembership: true })
  @ValidationBadRequest()
  @ApiCreatedResponse({
    description:
      'User creates a new meeting. A meeting url is returned when meeting starts now else the id of the meeting is returned',
    schema: {
      oneOf: [
        { type: 'string', example: 'https://meet.jit.si/ab1-3a2-4vs' },
        { type: 'number' },
      ],
    },
  })
  @ApiBadRequestResponse({
    description:
      'Error thrown when user membership is insufficient to create new meeting.',
    schema: errorResponseDoc(
      400,
      'Your meeting create operation failed due to insufficient membership.',
      ErrorTypes.INSUFFICIENT_MEMBERSHIP,
    ),
  })
  async createMeeting(
    @Body() createMeetingInfo: CreateMeetingDto,
    @CurrentUserProfile() user: UserProfile,
    @CurrentUserMembership() userMembership: UserMembership,
  ) {
    await this.meetingService.validateCreateMeeting(
      user.id,
      userMembership,
      createMeetingInfo.liveStream,
    );

    const { channelId, timeZone } = createMeetingInfo;

    const {
      jitsiConfig,
      privacyConfig,
    } = await this.meetingService.getMeetingConfig(user.id, createMeetingInfo);

    const publicMeeting = createMeetingInfo.public ?? privacyConfig.public;
    const liveStream = createMeetingInfo.liveStream ?? privacyConfig.liveStream;
    const record = createMeetingInfo.record ?? privacyConfig.record;
    const tokenExpiry =
      createMeetingInfo.joinLinkExpiryAsHours ??
      privacyConfig.joinLinkExpiryAsHours;

    const meetingPayload: Partial<PostEntity> = {
      title: createMeetingInfo.title || 'Untitled Meeting',
      description: createMeetingInfo.description,
      type: 'meeting',
      startDate: createMeetingInfo.startDate
        ? dayjs(createMeetingInfo.startDate)
            .tz(createMeetingInfo.timeZone, true)
            .toDate()
        : dayjs().tz(createMeetingInfo.timeZone, true).toDate(),
      endDate: createMeetingInfo.endDate
        ? dayjs(createMeetingInfo.endDate)
            .tz(createMeetingInfo.timeZone, true)
            .toDate()
        : dayjs(createMeetingInfo.startDate || new Date())
            .add(2, 'hours')
            .tz(createMeetingInfo.timeZone, true)
            .toDate(),
      createdById: user.id,
      record,
      liveStream,
    };

    if (channelId) {
      const userChannel: UserChannel = await this.meetingService.validateUserChannel(
        user.id,
        channelId,
      );
      meetingPayload.channelId = channelId;
      meetingPayload.public = userChannel.channel.public;
    } else {
      meetingPayload.public = publicMeeting;
    }

    meetingPayload.config = jitsiConfig;

    if (liveStream) meetingPayload.config.liveStreamingEnabled = true;
    if (record) meetingPayload.config.fileRecordingsEnabled = true;
    if (timeZone) meetingPayload.timeZone = timeZone;
    meetingPayload.allowComment =
      createMeetingInfo.allowComment ?? defaultPostSettings.allowComment;
    meetingPayload.allowDislike =
      createMeetingInfo.allowDislike ?? defaultPostSettings.allowDislike;
    meetingPayload.allowReaction =
      createMeetingInfo.allowReaction ?? defaultPostSettings.allowReaction;

    const meeting = await this.meetingService.createNewMeeting(meetingPayload);

    await this.meetingService.createMeetingTags(
      meeting.id,
      meeting.description,
    );

    const moderatorMeetingToken = await this.meetingService.sendMeetingInfoMail(
      user,
      meeting,
      true,
      tokenExpiry!,
    );

    if (
      createMeetingInfo.invitationIds &&
      createMeetingInfo.invitationIds.length
    ) {
      const users = await this.meetingService.getUsersById(
        createMeetingInfo.invitationIds,
      );

      users.forEach((u) => {
        this.meetingService.sendMeetingInfoMail(
          u,
          meeting,
          false,
          tokenExpiry!,
        );
      });
    }

    if (createMeetingInfo.saveConfig)
      await this.meetingService.saveCurrentUserMeetingConfig(user.id, {
        jitsiConfig,
        privacyConfig,
      });

    meeting.createdBy = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      displayPhoto: user.displayPhoto,
    } as User;
    meeting.postReaction = new PostReaction();

    if (!createMeetingInfo.startDate) {
      const meetingUrl = await this.meetingService.generateMeetingUrl(
        meeting,
        moderatorMeetingToken,
      );
      return { meetingUrl, meeting };
    }

    return { meeting };
  }

  @Get('join-link/:slug')
  @ApiNotFoundResponse({
    description: "Error thrown is meeting doesn't exist",
    schema: errorResponseDoc(404, 'Meeting not found', 'MEETING_NOT_FOUND'),
  })
  @ApiBadRequestResponse({
    description:
      "Error thrown when meeting's start date is less than now or meeting has already ended",
    schema: {
      anyOf: [
        errorResponseDoc(404, 'Meeting not started yet', 'MEETING_NOT_STARTED'),
        errorResponseDoc(
          404,
          'Meeting has already ended',
          'MEETING_ALREADY_ENDED',
        ),
      ],
    },
  })
  @ApiOkResponse({
    description: 'Meeting link with requested slug will returned',
    schema: { type: 'string', example: 'https://meet.jit.si/ab1-3a2-4vs' },
  })
  @IsAuthenticated([], { injectUserProfile: true })
  async getMeetingJoinLink(
    @CurrentUserProfile() user: UserProfile,
    @Param('slug') slug: string,
  ) {
    const meeting = await this.meetingService.currentUserJoinMeetingValidator(
      user.id,
      slug,
    );
    if (!meeting)
      throw new NotFoundException('Meeting not found', 'MEETING_NOT_FOUND');

    if (meeting.conferenceEndDate) {
      throw new BadRequestException(
        'Meeting has already ended',
        'MEETING_ALREADY_ENDED',
      );
    }

    const userConfig = await this.meetingService.getCurrentUserConfig(user.id);

    const meetingToken = await this.meetingService.generateMeetingToken(
      meeting,
      user,
      meeting.createdById === user.id,
      userConfig
        ? userConfig.privacyConfig.joinLinkExpiryAsHours!
        : defaultPrivacyConfig.joinLinkExpiryAsHours!,
    );

    return this.meetingService.generateMeetingUrl(meeting, meetingToken);
  }

  @Get('join/:token')
  @ApiOkResponse({ description: 'User redirected to meeting url' })
  @ApiNotFoundResponse({
    description:
      "Error thrown is meeting doesn't exist or current user doesn't have the priviledge to join",
    schema: errorResponseDoc(404, 'Meeting not found', 'MEETING_NOT_FOUND'),
  })
  @ApiBadRequestResponse({
    description:
      "Error thrown when meeting's start date is less than now or meeting has already ended",
    schema: {
      anyOf: [
        errorResponseDoc(404, 'Meeting not started yet', 'MEETING_NOT_STARTED'),
        errorResponseDoc(
          404,
          'Meeting has already ended',
          'MEETING_ALREADY_ENDED',
        ),
      ],
    },
  })
  async joinMeeting(@Param('token') token: string, @Res() res: Response) {
    const jitsiToken = await this.meetingService.verifyJitsiToken(token);
    const { user } = jitsiToken.context;

    const meeting = await this.meetingService.currentUserJoinMeetingValidator(
      user.id,
      user.room,
    );

    if (!meeting)
      throw new NotFoundException('Meeting not found', 'MEETING_NOT_FOUND');

    if (meeting.createdById !== user.id && meeting.conferenceEndDate) {
      throw new BadRequestException(
        'Meeting has already ended',
        'MEETING_ALREADY_ENDED',
      );
    }

    if (meeting.createdById !== user.id && dayjs().isBefore(meeting.startDate))
      throw new BadRequestException(
        'Meeting has not started yet',
        'MEETING_NOT_STARTED',
      );

    const url = await this.meetingService.generateMeetingUrl(meeting, token);
    return res.redirect(url);
  }

  @Get('config/user')
  @ApiOkResponse({
    description: 'User loads meeting configuration',
    type: MeetingConfig,
  })
  @ApiNotFoundResponse({
    description: 'Error thrown when the user meeting config not found',
    schema: errorResponseDoc(
      404,
      'User Meeting configuration not found',
      'MEETING_CONFIG_NOT_FOUND',
    ),
  })
  @IsAuthenticated()
  async getCurrentUserMeetingConfig(@CurrentUser() user: UserTokenPayload) {
    const result = await this.meetingService.getCurrentUserConfig(user.id);

    if (!result)
      throw new NotFoundException(
        ErrorTypes.MEETING_CONFIG_NOT_FOUND,
        'User Meeting configuration not found',
      );
    return result;
  }

  @ApiExcludeEndpoint()
  @Get('logs/list/:meetingSlug')
  @ApiOkResponse({
    description: 'User gets meeting logs',
  })
  @IsAuthenticated()
  async getMeetingLogs(
    @CurrentUser() user: UserTokenPayload,
    @Param('meetingSlug') meetingSlug: string,
    @Query() query: PaginationQuery,
  ) {
    return this.meetingService.getMeetingLogs(user.id, meetingSlug, query);
  }

  @ApiExcludeEndpoint()
  @Get('recordings/list/:meetingSlug')
  @ApiOkResponse({
    description: 'User gets meeting recordings',
  })
  @IsAuthenticated()
  async getMeetingRecordings(
    @CurrentUser() user: UserTokenPayload,
    @Param('meetingSlug') meetingSlug: string,
    @Query() query: PaginationQuery,
  ) {
    await this.meetingService.currentUserRecordingValidator(
      user.id,
      meetingSlug,
    );

    return this.meetingService.getMeetingRecordingList(meetingSlug, query);
  }

  @ApiExcludeEndpoint()
  @Post('/events/:identifier/:eventName')
  @ApiCreatedResponse({
    description:
      'Client sends an event relating to a meeting. Client must have manageMeeting permission.',
    schema: { type: 'string', example: 'OK' },
  })
  @ValidationBadRequest()
  @IsClientAuthenticated(['manageMeeting'])
  async handleMeetingEvent(
    @Body() info: Record<string, any>,
    @Param('eventName') eventName: MeetingEvent,
  ) {
    try {
      await this.meetingService.setMeetingStatus({
        userId: info.occupant?.id,
        event: eventName,
        slug: info.room_name,
      });
      return 'OK';
    } catch (err: any) {
      throw new NotFoundException(err);
    }
  }

  @ApiExcludeEndpoint()
  @Post('/client/verify')
  @ApiCreatedResponse({
    description:
      'Client athenticates an purpie user for a meeting. Client must have manageMeeting permission.',
    schema: { type: 'string', example: 'OK' },
  })
  @ApiNotFoundResponse({
    description:
      "Error thrown is meeting doesn't exist or current user doesn't have the priviledge to join",
    schema: errorResponseDoc(404, 'Meeting not found', 'MEETING_NOT_FOUND'),
  })
  @ValidationBadRequest()
  @IsClientAuthenticated(['manageMeeting'])
  async verifyMeetingAuthorization(@Body() info: ClientVerifyMeetingAuthDto) {
    const meeting = await this.meetingService.currentUserJoinMeetingValidator(
      info.userId,
      info.slug,
    );

    if (!meeting)
      throw new NotFoundException('Meeting not found', 'MEETING_NOT_FOUND');

    return 'OK';
  }

  @ApiExcludeEndpoint()
  @Get('conference/info')
  @ApiOkResponse({
    description: 'Get current conference information',
    type: ConferenceInfoResponse,
  })
  @IsConferenceUserAuthenticated()
  async getConferenceInfo(
    @ConferenceRoomName() room: string,
    @CurrentConferenceUser() user: ConferenceUser,
  ) {
    return this.meetingService.getConferenceInfo(room, user.id);
  }
}

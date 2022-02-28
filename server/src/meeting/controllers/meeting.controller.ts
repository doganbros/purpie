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
  CurrentUserProfile,
} from 'src/auth/decorators/current-user.decorator';
import {
  UserProfile,
  UserTokenPayload,
} from 'src/auth/interfaces/user.interface';
import { PaginationQuery } from 'types/PaginationQuery';
import { MeetingConfig } from 'types/Meeting';
import { errorResponseDoc } from 'helpers/error-response-doc';
import { ValidationBadRequest } from 'src/utils/decorators/validation-bad-request.decorator';
import { IsClientAuthenticated } from 'src/auth/decorators/client-auth.decorator';
import { CreateMeetingDto } from '../dto/create-meeting.dto';
import { MeetingService } from '../services/meeting.service';
import { ClientMeetingEventDto } from '../dto/client-meeting-event.dto';
import { ClientVerifyMeetingAuthDto } from '../dto/client-verify-meeting-auth.dto';

dayjs.extend(utc);
dayjs.extend(timezone);
@Controller({ path: 'meeting', version: '1' })
@ApiTags('meeting')
export class MeetingController {
  constructor(private meetingService: MeetingService) {}

  @Post('create')
  @IsAuthenticated([], { injectUserProfile: true })
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
  async createMeeting(
    @Body() createMeetingInfo: CreateMeetingDto,
    @CurrentUserProfile() user: UserProfile,
  ) {
    const { channelId, timeZone } = createMeetingInfo;

    const {
      jitsiConfig,
      privacyConfig,
    } = await this.meetingService.getMeetingConfig(user.id, createMeetingInfo);

    if (
      createMeetingInfo.public === true &&
      createMeetingInfo.userContactExclusive === true
    )
      createMeetingInfo.userContactExclusive = false;

    const userContactExclusive =
      createMeetingInfo.userContactExclusive ??
      privacyConfig.userContactExclusive;
    const publicMeeting = createMeetingInfo.public ?? privacyConfig.public;
    const liveStream = createMeetingInfo.liveStream ?? privacyConfig.liveStream;
    const record = createMeetingInfo.record ?? privacyConfig.record;

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
      await this.meetingService.validateUserChannel(user.id, channelId);
      meetingPayload.channelId = channelId;
    } else {
      meetingPayload.public = publicMeeting === true;
      meetingPayload.userContactExclusive =
        userContactExclusive === true && !meetingPayload.public;
    }

    meetingPayload.config = jitsiConfig;

    if (liveStream) meetingPayload.config.liveStreamingEnabled = true;
    if (record) meetingPayload.config.fileRecordingsEnabled = true;
    if (timeZone) meetingPayload.timeZone = timeZone;

    const meeting = await this.meetingService.createNewMeeting(meetingPayload);

    await this.meetingService.createMeetingTags(
      meeting.id,
      meeting.description,
    );

    this.meetingService.sendMeetingInfoMail(user, meeting, true);

    if (
      createMeetingInfo.invitationIds &&
      createMeetingInfo.invitationIds.length
    ) {
      const users = await this.meetingService.getUsersById(
        createMeetingInfo.invitationIds,
      );

      users.forEach((u) => {
        this.meetingService.sendMeetingInfoMail(u, meeting, false);
      });
    }

    if (createMeetingInfo.saveConfig)
      this.meetingService.saveCurrentUserMeetingConfig(user.id, {
        jitsiConfig,
        privacyConfig,
      });

    if (!createMeetingInfo.startDate)
      return this.meetingService.generateMeetingUrl(meeting, user, true);

    return meeting.id;
  }

  @Get('join/:slug')
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
  @IsAuthenticated([], { injectUserProfile: true })
  async joinMeeting(
    @Param('slug') slug: string,
    @CurrentUserProfile() user: UserProfile,
    @Res() res: Response,
  ) {
    const meeting = await this.meetingService.currentUserJoinMeetingValidator(
      user.id,
      slug,
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

    const url = await this.meetingService.generateMeetingUrl(
      meeting,
      user,
      user.id === meeting.createdById,
    );
    return res.redirect(url);
  }

  @Get('config/user')
  @ApiOkResponse({
    description: 'User loads meeting configuration',
    type: MeetingConfig,
  })
  @IsAuthenticated()
  async getCurrentUserMeetingConfig(@CurrentUser() user: UserTokenPayload) {
    const result = await this.meetingService.getCurrentUserConfig(user.id);

    if (!result)
      throw new NotFoundException('User Meeting configuration not found');
    return result;
  }

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

  @Post('/client/event')
  @ApiCreatedResponse({
    description:
      'Client sends an event relating to a meeting. Client must have manageMeeting permission.',
    schema: { type: 'string', example: 'OK' },
  })
  @ValidationBadRequest()
  @IsClientAuthenticated(['manageMeeting'])
  async setMeetingStatus(@Body() info: ClientMeetingEventDto) {
    await this.meetingService.setMeetingStatus(info);
    return 'OK';
  }

  @Post('/client/verify')
  @ApiCreatedResponse({
    description:
      'Client athenticates an octopus user for a meeting. Client must have manageMeeting permission.',
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
      info.meetingTitle,
    );

    if (!meeting)
      throw new NotFoundException('Meeting not found', 'MEETING_NOT_FOUND');

    return 'OK';
  }
}
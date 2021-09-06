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
import { Meeting } from 'entities/Meeting.entity';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserPayload } from 'src/auth/interfaces/user.interface';
import { PaginationQuery } from 'types/PaginationQuery';
import { PaginationQueryParams } from 'src/utils/decorators/pagination-query-params.decorator';
import { ChannelIdParams } from 'src/channel/dto/channel-id.params';
import { MeetingConfig } from 'types/Meeting';
import { UserZoneRole } from 'src/zone/decorators/user-zone-role.decorator';
import { errorResponseDoc } from 'helpers/error-response-doc';
import { ZoneIdParams } from 'src/zone/dto/zone-id.params';
import { ValidationBadRequest } from 'src/utils/decorators/validation-bad-request.decorator';
import { UserChannelRole } from 'src/channel/decorators/user-channel-role.decorator';
import { IsClientAuthenticated } from 'src/auth/decorators/client-auth.decorator';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { MeetingService } from './meeting.service';
import { MeetingIdParams } from './dto/meeting-id.param';
import { ClientMeetingEventDto } from './dto/client-meeting-event.dto';
import { ClientVerifyMeetingAuthDto } from './dto/client-verify-meeting-auth.dto';
import {
  MixedMeetingListResponse,
  PublicMeetingListResponse,
} from './responses/meeting.response';

dayjs.extend(utc);
dayjs.extend(timezone);

@Controller({ path: 'meeting', version: '1' })
@ApiTags('meeting')
export class MeetingController {
  constructor(private meetingService: MeetingService) {}

  @Post('create')
  @IsAuthenticated()
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
    @CurrentUser() user: UserPayload,
  ) {
    const meetingPayload: Partial<Meeting> = {
      title: createMeetingInfo.title || 'Untiltled Meeting',
      description: createMeetingInfo.description,
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
    };

    const {
      public: publicMeeting,
      userContactExclusive,
      channelId,
      config,
      liveStream,
      record,
      timeZone,
    } = createMeetingInfo;

    if (channelId) {
      await this.meetingService.validateUserChannel(user.id, channelId);
      meetingPayload.channelId = channelId;
    } else {
      meetingPayload.public = publicMeeting === true;
      meetingPayload.userContactExclusive =
        userContactExclusive === true && !publicMeeting;
    }

    meetingPayload.config = await this.meetingService.getMeetingConfig(
      user.id,
      config,
    );

    if (liveStream) meetingPayload.config.liveStreamingEnabled = true;
    if (record) meetingPayload.config.fileRecordingsEnabled = true;
    if (timeZone) meetingPayload.timeZone = timeZone;

    const meeting = await this.meetingService.createNewMeeting(meetingPayload);

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
      this.meetingService.saveCurrentUserMeetingConfig(
        user.id,
        meetingPayload.config,
      );

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
  @IsAuthenticated()
  async joinMeeting(
    @Param('slug') slug: string,
    @CurrentUser() user: UserPayload,
    @Res() res: Response,
  ) {
    const meeting = await this.meetingService.currentUserJoinMeetingValidator(
      user.id,
      slug,
    );

    if (!meeting)
      throw new NotFoundException('Meeting not found', 'MEETING_NOT_FOUND');

    if (meeting.conferenceEndDate)
      throw new BadRequestException(
        'Meeting has already ended',
        'MEETING_ALREADY_ENDED',
      );

    if (dayjs().isBefore(meeting.startDate))
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

  @Delete('remove/:meetingId')
  @ApiOkResponse({
    description: 'User removes a meeting by id',
    schema: { type: 'string', example: 'OK' },
  })
  @HttpCode(HttpStatus.OK)
  @IsAuthenticated()
  async removeMeeting(
    @Param() { meetingId }: MeetingIdParams,
    @CurrentUser() user: UserPayload,
  ) {
    await this.meetingService.removeMeeting(meetingId, user.id);
    return 'OK';
  }

  @Get('config/user')
  @ApiOkResponse({
    description: 'User loads meeting configuration',
    type: MeetingConfig,
  })
  @IsAuthenticated()
  async getCurrentUserMeetingConfig(@CurrentUser() user: UserPayload) {
    const result = await this.meetingService.getCurrentUserConfig(user.id);

    if (!result)
      throw new NotFoundException('User Meeting configuration not found');
    return result;
  }

  @Get('logs/list/:meetingSlug')
  @ApiOkResponse({
    description: 'User gets meeting logs',
  })
  @PaginationQueryParams()
  @IsAuthenticated()
  async getMeetingLogs(
    @CurrentUser() user: UserPayload,
    @Param('meetingSlug') meetingSlug: string,
    @Query() query: PaginationQuery,
  ) {
    return this.meetingService.getMeetingLogs(user.id, meetingSlug, query);
  }

  @Get('list/public')
  @ApiOkResponse({
    description: 'User lists public meetings',
    type: PublicMeetingListResponse,
  })
  @PaginationQueryParams()
  @IsAuthenticated()
  async getPublicMeetings(@Query() query: PaginationQuery) {
    return this.meetingService.getPublicMeetings(query);
  }

  @Get('list/user')
  @ApiOkResponse({
    description: 'User lists meetings from their contacts and channels',
    type: MixedMeetingListResponse,
  })
  @PaginationQueryParams()
  @IsAuthenticated()
  async getUserMeetings(
    @CurrentUser() user: UserPayload,
    @Query() query: PaginationQuery,
  ) {
    return this.meetingService.getUserMeetings(user.id, query);
  }

  @Get('list/zone/:zoneId')
  @ApiOkResponse({
    description: 'User lists meetings from channels of this zone',
    type: MixedMeetingListResponse,
  })
  @PaginationQueryParams()
  @UserZoneRole()
  async getZoneMeetings(
    @CurrentUser() user: UserPayload,
    @Query() query: PaginationQuery,
    @Param() { zoneId }: ZoneIdParams,
  ) {
    return this.meetingService.getZoneMeetings(zoneId, user.id, query);
  }

  @Get('list/channel/:channelId')
  @ApiOkResponse({
    description: 'User lists meetings from this channel',
    type: MixedMeetingListResponse,
  })
  @PaginationQueryParams()
  @UserChannelRole()
  async getChannelMeetings(
    @CurrentUser() user: UserPayload,
    @Query() query: PaginationQuery,
    @Param() { channelId }: ChannelIdParams,
  ) {
    return this.meetingService.getChannelMeetings(channelId, user.id, query);
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

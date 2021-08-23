import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import dayjs from 'dayjs';
import { Meeting } from 'entities/Meeting.entity';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserPayload } from 'src/auth/interfaces/user.interface';
import { PaginationQuery } from 'types/PaginationQuery';
import { PaginationQueryParams } from 'src/utils/decorators/pagination-query-params.decorator';
import { ChannelIdParams } from 'src/channel/dto/channel-id.params';
import { UserZoneRole } from 'src/zone/decorators/user-zone-role.decorator';
import { ZoneIdParams } from 'src/zone/dto/zone-id.params';
import { UserChannelRole } from 'src/channel/decorators/user-channel-role.decorator';
import { IsClientAuthenticated } from 'src/auth/decorators/client-auth.decorator';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { MeetingService } from './meeting.service';
import { MeetingIdParams } from './dto/meeting-id.param';
import { ClientMeetingEventDto } from './dto/client-meeting-event.dto';
import { ClientVerifyMeetingAuthDto } from './dto/client-verify-meeting-auth.dto';

@Controller({ path: 'meeting', version: '1' })
@ApiTags('meeting')
export class MeetingController {
  constructor(private meetingService: MeetingService) {}

  @Post('create')
  @IsAuthenticated()
  async createMeeting(
    @Body() createMeetingInfo: CreateMeetingDto,
    @CurrentUser() user: UserPayload,
  ) {
    const meetingPayload: Partial<Meeting> = {
      title: createMeetingInfo.title || 'Untiltled Meeting',
      description: createMeetingInfo.description,
      startDate: createMeetingInfo.startDate ?? new Date(),
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

    if (createMeetingInfo.saveConfig)
      this.meetingService.saveCurrentUserMeetingConfig(
        user.id,
        meetingPayload.config,
      );

    if (!createMeetingInfo.startDate)
      return this.meetingService.generateMeetingUrl(meeting, user, true);

    return meeting;
  }

  @Get('join/:slug')
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

    if (meeting.endDate)
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
  @IsAuthenticated()
  async removeMeeting(
    @Param() { meetingId }: MeetingIdParams,
    @CurrentUser() user: UserPayload,
  ) {
    return this.meetingService.removeMeeting(meetingId, user.id);
  }

  @Get('config/user')
  @IsAuthenticated()
  async getCurrentUserMeetingConfig(@CurrentUser() user: UserPayload) {
    const result = await this.meetingService.getCurrentUserConfig(user.id);

    if (!result)
      throw new NotFoundException('User Meeting configuration not found');
    return result;
  }

  @Get('list/public')
  @PaginationQueryParams()
  @IsAuthenticated()
  async getPublicMeetings(@Query() query: PaginationQuery) {
    return this.meetingService.getPublicMeetings(query);
  }

  @Get('list/user')
  @PaginationQueryParams()
  @IsAuthenticated()
  async getUserMeetings(
    @CurrentUser() user: UserPayload,
    @Query() query: PaginationQuery,
  ) {
    return this.meetingService.getUserMeetings(user.id, query);
  }

  @Get('list/zone/:zoneId')
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
  @IsClientAuthenticated(['manageMeeting'])
  async setMeetingStatus(@Body() info: ClientMeetingEventDto) {
    return this.meetingService.setMeetingStatus(info);
  }

  @Post('/client/verify')
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

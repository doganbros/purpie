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
import slugify from 'slugify';
import { nanoid } from 'nanoid';
import { Response } from 'express';
import dayjs from 'dayjs';
import { Meeting } from 'entities/Meeting.entity';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserPayload } from 'src/auth/interfaces/user.interface';
import { PaginationQuery } from 'types/PaginationQuery';
import { PaginationQueryParams } from 'src/utils/decorators/pagination-query-params.decorator';
import { ChannelIdParams } from 'src/channel/dto/channel-id.params';
import { MeetingKey } from 'types/Meeting';
import { UserZoneRole } from 'src/zone/decorators/user-zone-role.decorator';
import { ZoneIdParams } from 'src/zone/dto/zone-id.params';
import { UserChannelRole } from 'src/channel/decorators/user-channel-role.decorator';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { MeetingService } from './meeting.service';
import { MeetingIdParams } from './dto/meeting-id.param';

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
      title: createMeetingInfo.title || 'New Meeting',
      description: createMeetingInfo.description,
      startDate: createMeetingInfo.startDate ?? new Date(),
      createdById: user.id,
    };

    meetingPayload.slug = `${slugify(
      meetingPayload.title!,
    )}-${nanoid()}`.toLowerCase();

    const {
      public: publicMeeting,
      userContactExclusive,
      zoneId,
      channelId,
    } = createMeetingInfo;

    if (publicMeeting || userContactExclusive) {
      meetingPayload.config = await this.meetingService.getCurrentUserConfig(
        user.id,
      );
      if (!meetingPayload.config)
        throw new NotFoundException('User not found', 'USER_NOT_FOUND');

      meetingPayload.public = publicMeeting === true;
      meetingPayload.userContactExclusive =
        userContactExclusive === true && !publicMeeting;
    } else if (zoneId) {
      meetingPayload.config = await this.meetingService.getCurrentUserZoneConfig(
        user.id,
        zoneId,
      );
      if (!meetingPayload.config)
        throw new NotFoundException('Zone not found', 'ZONE_NOT_FOUND');
      meetingPayload.zoneId = zoneId;
    } else if (channelId) {
      meetingPayload.config = await this.meetingService.getCurrentUserChannelConfig(
        user.id,
        channelId,
      );
      if (!meetingPayload.config)
        throw new NotFoundException('Channel not found', 'CHANNEL_NOT_FOUND');
      meetingPayload.channelId = channelId;
    }

    if (createMeetingInfo.config) {
      for (const key in createMeetingInfo.config)
        if (!(key in meetingPayload.config!))
          delete createMeetingInfo.config![key as MeetingKey];

      meetingPayload.config = {
        ...meetingPayload.config,
        ...createMeetingInfo.config,
      };
    }

    const meeting = await this.meetingService.createNewMeeting(meetingPayload);

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
}

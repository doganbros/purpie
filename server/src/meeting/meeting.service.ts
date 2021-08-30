import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import crypto from 'crypto';

import { Meeting } from 'entities/Meeting.entity';
import { User } from 'entities/User.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { UserZone } from 'entities/UserZone.entity';
import { generateJWT } from 'helpers/jwt';
import { Brackets, DeepPartial, IsNull, Repository } from 'typeorm';
import { UserPayload } from 'src/auth/interfaces/user.interface';
import {
  generateLowerAlphaNumId,
  meetingConfigStringify,
  separateString,
} from 'helpers/utils';
import { Contact } from 'entities/Contact.entity';
import { MeetingAttendance } from 'entities/MeetingAttendance.entity';
import { PaginationQuery } from 'types/PaginationQuery';
import { Channel } from 'entities/Channel.entity';
import { baseMeetingConfig } from 'entities/data/base-meeting-config';
import { MeetingConfig, MeetingKey } from 'types/Meeting';
import { MailService } from 'src/mail/mail.service';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { ClientMeetingEventDto } from './dto/client-meeting-event.dto';

dayjs.extend(utc);
dayjs.extend(timezone);

const {
  JITSI_SECRET = '',
  JITSI_DOMAIN = 'https://meet.doganbros.com',
  REACT_APP_SERVER_HOST = '',
} = process.env;

@Injectable()
export class MeetingService {
  constructor(
    @InjectRepository(Meeting) private meetingRepository: Repository<Meeting>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(MeetingAttendance)
    private meetingAttendanceRepository: Repository<MeetingAttendance>,
    @InjectRepository(UserChannel)
    private userChannelRepository: Repository<UserChannel>,
    private mailService: MailService,
  ) {}

  async validateUserChannel(userId: number, channelId: number) {
    const userChannel = await this.userChannelRepository.findOne({
      channelId,
      userId,
    });
    if (!userChannel) throw new NotFoundException('User channel not found');
  }

  async getMeetingConfig(userId: number, config?: Record<string, any>) {
    const meetingConfig =
      (await this.getCurrentUserConfig(userId)) || baseMeetingConfig;

    if (config) {
      for (const key in config)
        if (key in baseMeetingConfig)
          meetingConfig[key as MeetingKey] = config[key];
    }
    return meetingConfig;
  }

  async createNewMeeting(payload: DeepPartial<Meeting>) {
    const maxCreateAttempts = 5;
    let createAttempts = 0;

    while (createAttempts < maxCreateAttempts) {
      try {
        payload.slug = separateString(generateLowerAlphaNumId(9), 3);
        const meeting = await this.meetingRepository.create(payload).save();
        return meeting;
      } catch (err) {
        if (createAttempts === maxCreateAttempts) throw err;
        createAttempts++;
      }
    }

    throw new InternalServerErrorException(
      'Could not create meeting',
      'COULD_NOT_CREATE_MEETING',
    );
  }

  getUsersById(ids: Array<number>) {
    return this.userRepository.findByIds(ids);
  }

  async sendMeetingInfoMail(
    user: UserPayload,
    meeting: Meeting,
    creator = false,
  ) {
    const context = {
      firstName: user.firstName,
      lastName: user.lastName,
      creator,
      meeting: {
        ...meeting,
        endDate: meeting.endDate
          ? dayjs(meeting.endDate)
              .tz(meeting.timeZone || undefined)
              .format('dddd D MMMM, YYYY h:mm A Z')
          : null,
        startDate: dayjs(meeting.startDate)
          .tz(meeting.timeZone || undefined)
          .format('dddd D MMMM, YYYY h:mm A Z'),
      },
      link: `${REACT_APP_SERVER_HOST}/v1/meeting/join/${meeting.slug}`,
    };
    return this.mailService.sendMailByView(
      user.email,
      'Octopus Meeting',
      'meeting-info',
      context,
    );
  }

  currentUserJoinMeetingValidator(userId: number, slug: string) {
    return this.meetingRepository
      .createQueryBuilder('meeting')
      .leftJoin(
        UserChannel,
        'user_channel',
        'meeting.channelId = user_channel.channelId AND user_channel.userId = :userId',
        { userId },
      )
      .leftJoin(
        Contact,
        'contact',
        'meeting.userContactExclusive = true AND meeting.createdById = contact.userId AND contact.contactUserId = :userId',
        { userId },
      )

      .where('meeting.slug = :slug', { slug })
      .andWhere(
        new Brackets((qb) => {
          qb.where('meeting.public = true')
            .orWhere('user_channel.channelId is not null')
            .orWhere('meeting.createdById = :userId', { userId })
            .orWhere('contact.contactUserId is not null');
        }),
      )
      .getOne();
  }

  async getCurrentUserConfig(userId: number) {
    return this.userRepository
      .findOne({
        where: { id: userId },
        select: ['userMeetingConfig'],
      })
      .then((result) => result?.userMeetingConfig);
  }

  async saveCurrentUserMeetingConfig(userId: number, config: MeetingConfig) {
    return this.userRepository.update(userId, { userMeetingConfig: config });
  }

  async getCurrentUserChannelConfig(userId: number, channelId: number) {
    return this.userChannelRepository
      .findOne({
        where: { userId, channelId },
        relations: ['zone'],
      })
      .then((result) => result?.channel.channelMeetingConfig);
  }

  async generateMeetingUrl(
    meeting: Meeting,
    user: UserPayload,
    moderator: boolean,
  ) {
    const token = await this.generateMeetingToken(meeting, user, moderator);

    meeting.config.subject = meeting.title;
    const meetingConfig = meetingConfigStringify(meeting.config);

    return `${JITSI_DOMAIN}/${meeting.slug}?jwt=${token}#${meetingConfig}`;
  }

  async generateMeetingToken(
    meeting: Meeting,
    user: UserPayload,
    moderator: boolean,
  ) {
    const payload = {
      context: {
        user: {
          avatar: `https://gravatar.com/avatar/${crypto
            .createHash('md5')
            .update(user.email)
            .digest('hex')}`,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          id: user.id,
          moderator,
        },
        group: 'a122-123-456-789',
      },
      exp: 1696284052,
      aud: 'doganbros-meet',
      iss: 'doganbros-meet',
      nbf: 1596197652,
      room: meeting.slug,
      sub: new URL(JITSI_DOMAIN).hostname,
    };

    return generateJWT(payload, JITSI_SECRET);
  }

  async removeMeeting(meetingId: number, userId: number) {
    return this.meetingRepository.delete({
      id: meetingId,
      createdById: userId,
    });
  }

  get meetingSelections() {
    return this.meetingRepository
      .createQueryBuilder('meeting')
      .select([
        'meeting.id',
        'meeting.title',
        'meeting.slug',
        'meeting.description',
        'meeting.startDate',
        'meeting.public',
        'meeting.channelId',
        'meeting.record',
        'meeting.liveStream',
        'createdBy.id',
        'createdBy.email',
        'createdBy.firstName',
        'createdBy.lastName',
      ]);
  }

  async getPublicMeetings(query: PaginationQuery) {
    return this.meetingSelections
      .innerJoin('meeting.createdBy', 'createdBy')
      .where('meeting.conferenceEndDate is null')
      .andWhere('meeting.public = true')
      .orderBy('meeting.startDate', 'ASC')
      .paginate(query);
  }

  async getUserMeetings(userId: number, query: PaginationQuery) {
    return this.meetingSelections
      .addSelect([
        'channel.id',
        'channel.name',
        'channel.topic',
        'channel.description',
      ])
      .innerJoin('meeting.createdBy', 'createdBy')
      .leftJoin(
        UserChannel,
        'user_channel',
        'meeting.channelId = user_channel.channelId AND user_channel.userId = :userId',
        { userId },
      )
      .leftJoin(Channel, 'channel', 'channel.id = user_channel.channelId')
      .leftJoin(
        Contact,
        'contact',
        'meeting.userContactExclusive = true AND meeting.createdById = contact.userId AND contact.contactUserId = :userId',
        { userId },
      )
      .where('meeting.conferenceEndDate is null')
      .andWhere(
        new Brackets((qb) => {
          qb.where('user_channel.channelId is not null')
            .orWhere('contact.contactUserId is not null')
            .orWhere('meeting.createdById = :userId', { userId });
        }),
      )
      .orderBy('meeting.startDate', 'ASC')
      .paginate(query);
  }

  async getZoneMeetings(
    zoneId: number,
    userId: number,
    query: PaginationQuery,
  ) {
    return this.meetingSelections
      .addSelect([
        'channel.id',
        'channel.name',
        'channel.topic',
        'channel.description',
      ])
      .innerJoin('meeting.createdBy', 'createdBy')
      .innerJoin(
        UserZone,
        'user_zone',
        'user_zone.zoneId = :zoneId and user_zone.userId = :userId',
        {
          userId,
          zoneId,
        },
      )
      .innerJoin(
        UserChannel,
        'user_channel',
        'user_channel.channelId = meeting.channelId',
      )
      .innerJoin('meeting.channel', 'channel')
      .where(
        'channel.id = user_channel.channelId and meeting.channelId = channel.id',
      )
      .andWhere('meeting.conferenceEndDate is null')
      .orderBy('meeting.startDate', 'ASC')
      .paginate(query);
  }

  async getChannelMeetings(
    channelId: number,
    userId: number,
    query: PaginationQuery,
  ) {
    return this.meetingSelections
      .addSelect([
        'channel.id',
        'channel.name',
        'channel.topic',
        'channel.description',
      ])
      .leftJoin('meeting.createdBy', 'createdBy')
      .innerJoin('meeting.channel', 'channel', 'meeting.channelId = channel.id')
      .innerJoin(
        UserChannel,
        'user_channel',
        'channel.id = user_channel.channelId AND user_channel.userId = :userId',
        { userId },
      )
      .where('channel.id = :channelId', { channelId })
      .andWhere('meeting.conferenceEndDate is null')
      .orderBy('meeting.startDate', 'ASC')
      .paginate(query);
  }

  async setMeetingStatus(info: ClientMeetingEventDto) {
    if (info.event === 'started') {
      return this.meetingRepository.update(
        { slug: info.meetingTitle, conferenceStartDate: IsNull() },
        { conferenceStartDate: new Date() },
      );
    }

    if (info.event === 'ended')
      return this.meetingRepository.update(
        { slug: info.meetingTitle, conferenceEndDate: IsNull() },
        { conferenceEndDate: new Date() },
      );

    if (info.event === 'user_joined')
      return this.meetingAttendanceRepository
        .create({
          userId: info.userId,
          startDate: new Date(),
          meetingSlug: info.meetingTitle,
        })
        .save();

    return this.meetingAttendanceRepository.update(
      {
        userId: info.userId,
        meetingSlug: info.meetingTitle,
        endDate: IsNull(),
      },
      { endDate: new Date() },
    );
  }
}

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Post } from 'entities/Post.entity';
import { User } from 'entities/User.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { PostVideo } from 'entities/PostVideo.entity';
import { generateJWT, verifyJWT } from 'helpers/jwt';
import { Brackets, DeepPartial, Repository } from 'typeorm';
import {
  UserMembership,
  UserProfile,
} from 'src/auth/interfaces/user.interface';
import {
  generateLowerAlphaNumId,
  meetingConfigStringify,
  parsePostTags,
  separateString,
} from 'helpers/utils';
import { Contact } from 'entities/Contact.entity';
import { MeetingLog } from 'entities/MeetingLog.entity';
import { PaginationQuery } from 'types/PaginationQuery';
import { baseMeetingConfig } from 'entities/data/base-meeting-config';
import { PostTag } from 'entities/PostTag.entity';
import { JitsiConfigKey, MeetingConfig } from 'types/Meeting';
import { MailService } from 'src/mail/mail.service';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { ClientMeetingEventDto } from '../dto/client-meeting-event.dto';
import { CreateMeetingDto } from '../dto/create-meeting.dto';
import { ConferenceInfoResponse } from '../responses/conference-info.response';
import { ErrorTypes } from '../../../types/ErrorTypes';
import { Call } from '../../../entities/Call.entity';

dayjs.extend(utc);
dayjs.extend(timezone);

const {
  JITSI_SECRET = '',
  JITSI_DOMAIN = '',
  RTMP_INGRESS_URL = '',
  REACT_APP_SERVER_HOST = '',
  JWT_APP_ID = 'doganbros-meet',
  MEETING_HOST = '',
} = process.env;

@Injectable()
export class MeetingService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(MeetingLog)
    private meetingLogRepository: Repository<MeetingLog>,
    @InjectRepository(PostVideo)
    private postVideoRepository: Repository<PostVideo>,
    @InjectRepository(Call)
    private callRepository: Repository<Call>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserChannel)
    private userChannelRepository: Repository<UserChannel>,
    @InjectRepository(PostTag)
    private postTagRepository: Repository<PostTag>,
    private mailService: MailService,
  ) {}

  async validateCreateMeeting(
    userId: string,
    membership: UserMembership,
    liveStream?: boolean,
  ) {
    const meetingCount = await this.postRepository.count({
      where: { createdById: userId, type: 'meeting' },
    });

    if (
      meetingCount >= membership.meetingCount ||
      (liveStream && !membership.streamMeeting)
    )
      throw new BadRequestException(
        ErrorTypes.INSUFFICIENT_MEMBERSHIP,
        'Your meeting create operation failed due to insufficient membership.',
      );
  }

  async validateUserChannel(
    userId: string,
    channelId: string,
  ): Promise<UserChannel> {
    const userChannel = await this.userChannelRepository.findOne({
      where: { channelId, userId },
      relations: ['channel'],
    });
    if (!userChannel)
      throw new NotFoundException(
        ErrorTypes.CHANNEL_NOT_FOUND,
        'User channel not found',
      );
    return userChannel;
  }

  async verifyJitsiToken(token: string) {
    return verifyJWT(token, JITSI_SECRET);
  }

  async getMeetingConfig(userId: string, createMeetingInfo: CreateMeetingDto) {
    const meetingConfig = (await this.getCurrentUserConfig(userId)) || {
      jitsiConfig: baseMeetingConfig,
      privacyConfig: {},
    };

    if (createMeetingInfo.config) {
      for (const key in createMeetingInfo.config)
        if (key in baseMeetingConfig) {
          meetingConfig.jitsiConfig[key as JitsiConfigKey] = createMeetingInfo
            .config[key as JitsiConfigKey] as any;
        }
    }

    meetingConfig.privacyConfig = {
      public:
        createMeetingInfo.public ?? meetingConfig.privacyConfig.public ?? true,
      liveStream:
        createMeetingInfo.liveStream ??
        meetingConfig.privacyConfig.liveStream ??
        false,
      record:
        createMeetingInfo.record ?? meetingConfig.privacyConfig.record ?? false,
      joinLinkExpiryAsHours:
        createMeetingInfo.joinLinkExpiryAsHours ??
        meetingConfig.privacyConfig.joinLinkExpiryAsHours,
    };

    return meetingConfig;
  }

  async createNewMeeting(payload: DeepPartial<Post>) {
    const maxCreateAttempts = 5;
    let createAttempts = 0;

    const request = payload;
    while (createAttempts < maxCreateAttempts) {
      try {
        request.slug = separateString(generateLowerAlphaNumId(9), 3);
        if (MEETING_HOST) {
          request.slug += `_${MEETING_HOST}`;
        }

        return this.postRepository.create(payload).save();
      } catch (err: any) {
        if (createAttempts === maxCreateAttempts) throw err;
        createAttempts++;
      }
    }

    throw new InternalServerErrorException(
      ErrorTypes.COULD_NOT_CREATE_MEETING,
      'Could not create meeting',
    );
  }

  async createMeetingTags(meetingId: string, description?: string) {
    const tags = parsePostTags(description);

    if (tags?.length) {
      return this.postTagRepository.insert(
        tags.map((v) => ({ value: v, postId: meetingId })),
      );
    }
    return null;
  }

  getUsersById(ids: Array<number>) {
    return this.userRepository.findByIds(ids);
  }

  async sendMeetingInfoMail(
    user: UserProfile,
    meeting: Post,
    moderator = false,
    tokenExpiry: number,
  ) {
    const meetingToken = await this.generateMeetingToken(
      meeting.slug,
      user,
      moderator,
      tokenExpiry,
    );

    const context = {
      fullName: user.fullName,
      creator: moderator,
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
      link: `${REACT_APP_SERVER_HOST}/v1/meeting/join/${meetingToken}`,
    };
    await this.mailService.sendMailByView(
      user.email,
      'Purpie Meeting',
      'meeting-info',
      context,
    );

    return meetingToken;
  }

  currentUserMeetingBaseValidator(userId: string, slug: string) {
    return this.postRepository
      .createQueryBuilder('meeting')
      .addSelect('meeting.config')
      .leftJoin(
        UserChannel,
        'user_channel',
        'meeting.channelId = user_channel.channelId AND user_channel.userId = :userId',
        { userId },
      )
      .leftJoin(
        Contact,
        'contact',
        'meeting.public = false AND meeting.createdById = contact.userId AND contact.contactUserId = :userId',
        { userId },
      )
      .where('meeting.slug = :slug', { slug })
      .andWhere('meeting.type = :type', { type: 'meeting' })
      .andWhere(
        new Brackets((qb) => {
          qb.where('meeting.public = true')
            .orWhere('user_channel.channelId is not null')
            .orWhere('meeting.createdById = :userId', { userId })
            .orWhere('contact.contactUserId is not null');
        }),
      );
  }

  async currentUserRecordingValidator(userId: string, slug: string) {
    const result = await this.currentUserMeetingBaseValidator(
      userId,
      slug,
    ).getOne();

    if (!result)
      throw new NotFoundException(
        ErrorTypes.MEETING_NOT_FOUND,
        'Meeting not found',
      );

    if (!result.record)
      throw new BadRequestException(
        ErrorTypes.MEETING_RECORDING_NOT_ENABLED,
        'Recording was not enabled for meeting',
      );

    return result;
  }

  async getMeetingRecordingList(slug: string, query: PaginationQuery) {
    return this.postVideoRepository
      .createQueryBuilder('meetingRecording')
      .where('meetingRecording.slug = :slug', { slug })
      .paginate(query);
  }

  currentUserJoinMeetingValidator(userId: string, slug: string) {
    return this.currentUserMeetingBaseValidator(userId, slug)
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            'meeting.conferenceEndDate is null',
          ).orWhere('meeting.createdById = :userId', { userId });
        }),
      )
      .getOne();
  }

  async getMeetingRecording(id: number, fileName: string) {
    return this.postVideoRepository
      .createQueryBuilder('meetingRecording')
      .where('meetingRecording.postId = :id', { id })
      .andWhere('meetingRecording.fileName = :fileName', { fileName })
      .getOne();
  }

  async getCurrentUserConfig(userId: string) {
    return this.userRepository
      .findOne({
        where: { id: userId },
        select: ['userMeetingConfig'],
      })
      .then((result) => result?.userMeetingConfig);
  }

  async saveCurrentUserMeetingConfig(userId: string, config: MeetingConfig) {
    return this.userRepository.update(userId, { userMeetingConfig: config });
  }

  async generateMeetingUrl(meeting: Post, token: string) {
    meeting.config.subject = meeting.title;
    const otherConfig: Record<string, any> = {
      autoRecording: meeting.record,
      autoStreaming: meeting.liveStream,
    };

    if (meeting.liveStream)
      otherConfig.ingressUrl = `${RTMP_INGRESS_URL}/${
        meeting.record ? 'stream-and-rec' : 'stream'
      }/${meeting.title}?uid=${meeting.createdById}`;

    const meetingConfig = meetingConfigStringify(meeting.config, otherConfig);

    return `${JITSI_DOMAIN}/${meeting.slug}?jwt=${token}#${meetingConfig}`;
  }

  async generateMeetingToken(
    room: string,
    user: UserProfile,
    moderator: boolean,
    tokenExpiry: number,
  ): Promise<string> {
    const now = new Date();
    const exp = Math.floor(now.setHours(now.getHours() + tokenExpiry) / 1000);

    const payload = {
      context: {
        user: {
          avatar: user.displayPhoto
            ? `${REACT_APP_SERVER_HOST}/v1/user/display-photo/${user.displayPhoto}`
            : undefined,
          name: user.fullName,
          email: user.email,
          id: user.id,
          room,
          lobby_bypass: moderator,
        },
        group: 'a122-123-456-789',
      },
      moderator,
      exp,
      aud: JWT_APP_ID,
      iss: JWT_APP_ID,
      room,
      sub: new URL(JITSI_DOMAIN).hostname,
    };
    return generateJWT(payload, JITSI_SECRET);
  }

  get meetingSelections() {
    return this.postRepository
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
        'createdBy.fullName',
      ]);
  }

  async getMeetingLogs(
    userId: string,
    meetingSlug: string,
    query: PaginationQuery,
  ) {
    return this.meetingLogRepository
      .createQueryBuilder('meeting_log')
      .select([
        'meeting_log.id',
        'meeting_log.createdOn',
        'meeting_log.extraInfo',
        'meeting_log.event',
        'meeting.id',
        'meeting.title',
        'meeting.slug',
        'meeting.description',
        'user.id',
        'user.userName',
        'user.email',
        'user.fullName',
      ])
      .innerJoin('meeting_log.meeting', 'meeting')
      .leftJoin('meeting_log.user', 'user')
      .where(
        'meeting.createdBy = :userId AND meeting_log.meetingSlug = :meetingSlug',
        { userId, meetingSlug },
      )
      .paginate(query);
  }

  async setMeetingStatus(info: ClientMeetingEventDto) {
    const meetingLog = this.meetingLogRepository.create({
      event: info.event,
      meetingSlug: info.slug,
    });

    if (info.event === 'created') {
      await this.postRepository.update(
        { slug: info.slug },
        { conferenceStartDate: new Date(), conferenceEndDate: null },
      );
    }

    if (info.event === 'destroyed') {
      await this.postRepository.update(
        { slug: info.slug },
        { conferenceEndDate: new Date() },
      );
    }

    // user events
    if (['joined', 'left'].includes(info.event))
      meetingLog.userId = info.userId!;

    return meetingLog.save();
  }

  async getConferenceInfo(
    slug: string,
    userId: string,
  ): Promise<ConferenceInfoResponse> {
    const meeting = await this.postRepository
      .createQueryBuilder('meeting')
      .leftJoinAndSelect('meeting.createdBy', 'createdBy')
      .leftJoinAndSelect('meeting.channel', 'channel')
      .leftJoinAndSelect(
        UserChannel,
        'user_channel',
        'user_channel.channelId = channel.id and user_channel.userId = :userId',
        { userId },
      )
      .leftJoinAndSelect('channel.zone', 'zone')
      .leftJoinAndSelect(
        Contact,
        'contact',
        'meeting.public = false AND contact.userId = meeting.createdById AND contact.contactUserId = :userId',
        { userId },
      )
      .where('meeting.slug = :slug', { slug })
      .andWhere('meeting.type = :postType', { postType: 'meeting' })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            new Brackets((qbi) => {
              qbi
                .orWhere('meeting.public = true')
                .orWhere('user_channel.id is not null')
                .orWhere('contact.contactUserId is not null');
            }),
          );
        }),
      )
      .getOne();

    if (!meeting) throw new NotFoundException('Meeting not found');

    if (meeting.channelId) {
      return {
        title: meeting.title,
        description: meeting.description,
        user: {
          fullName: meeting.createdBy.fullName,
          email: meeting.createdBy.email,
          userName: meeting.createdBy.userName,
          id: meeting.createdBy.id,
          photoURL: meeting.createdBy.displayPhoto
            ? `${REACT_APP_SERVER_HOST}/v1/user/display-photo/${meeting.createdBy.displayPhoto}`
            : null,
        },
        type: 'channel',
        channel: {
          name: meeting.channel.name,
          description: meeting.channel.description,
          public: meeting.channel.public,
          photoURL: meeting.channel.displayPhoto
            ? `${REACT_APP_SERVER_HOST}/v1/channel/display-photo/${meeting.channel.displayPhoto}`
            : null,
          zone: {
            name: meeting.channel.zone.name,
            description: meeting.channel.zone.description,
            subdomain: meeting.channel.zone.subdomain,
            public: meeting.channel.zone.public,
            photoURL: meeting.channel.zone.displayPhoto
              ? `${REACT_APP_SERVER_HOST}/v1/zone/display-photo/${meeting.channel.zone.displayPhoto}`
              : null,
          },
        },
      };
    }

    return {
      title: meeting.title,
      description: meeting.description,
      type: 'user',
      user: {
        fullName: meeting.createdBy.fullName,
        email: meeting.createdBy.email,
        userName: meeting.createdBy.userName,
        id: meeting.createdBy.id,
        photoURL: meeting.createdBy.displayPhoto
          ? `${REACT_APP_SERVER_HOST}/v1/user/display-photo/${meeting.createdBy.displayPhoto}`
          : null,
      },
    };
  }

  async getRecordingAndStreamingMeetingBySlug(slug: string) {
    return this.postRepository.findOneOrFail({
      where: { slug, record: true, streaming: true },
      relations: ['createdBy'],
    });
  }

  async getActiveCall(userId: string) {
    return this.callRepository
      .createQueryBuilder('call')
      .where('isActive = true')
      .andWhere(
        new Brackets((qb) => {
          qb.where('call.createdById = :userId', {
            userId,
          }).orWhere('call.callee = :userId', { userId });
        }),
      )
      .getOne();
  }

  async createCall(userId: string, calleeId: string, roomName: string) {
    await this.callRepository
      .create({
        callee: calleeId,
        roomName,
        createdById: userId,
      })
      .save();
  }
}

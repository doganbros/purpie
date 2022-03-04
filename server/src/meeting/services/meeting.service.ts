import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import crypto from 'crypto';

import { Post } from 'entities/Post.entity';
import { User } from 'entities/User.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { PostVideo } from 'entities/PostVideo.entity';
import { generateJWT } from 'helpers/jwt';
import { Brackets, DeepPartial, Repository } from 'typeorm';
import { UserProfile } from 'src/auth/interfaces/user.interface';
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

dayjs.extend(utc);
dayjs.extend(timezone);

const {
  JITSI_SECRET = '',
  JITSI_DOMAIN = '',
  RTMP_INGRESS_URL = '',
  REACT_APP_SERVER_HOST = '',
  JWT_APP_ID = 'doganbros-meet',
} = process.env;

@Injectable()
export class MeetingService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(MeetingLog)
    private meetingLogRepository: Repository<MeetingLog>,
    @InjectRepository(PostVideo)
    private postVideoRepository: Repository<PostVideo>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserChannel)
    private userChannelRepository: Repository<UserChannel>,
    @InjectRepository(PostTag)
    private postTagRepository: Repository<PostTag>,
    private mailService: MailService,
  ) {}

  async validateUserChannel(userId: number, channelId: number) {
    const userChannel = await this.userChannelRepository.findOne({
      channelId,
      userId,
    });
    if (!userChannel) throw new NotFoundException('User channel not found');
  }

  async getMeetingConfig(userId: number, createMeetingInfo: CreateMeetingDto) {
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
      userContactExclusive:
        createMeetingInfo.userContactExclusive ??
        meetingConfig.privacyConfig.userContactExclusive ??
        false,
      liveStream:
        createMeetingInfo.liveStream ??
        meetingConfig.privacyConfig.liveStream ??
        false,
      record:
        createMeetingInfo.record ?? meetingConfig.privacyConfig.record ?? false,
    };

    return meetingConfig;
  }

  async createNewMeeting(payload: DeepPartial<Post>) {
    const maxCreateAttempts = 5;
    let createAttempts = 0;

    while (createAttempts < maxCreateAttempts) {
      try {
        payload.slug = separateString(generateLowerAlphaNumId(9), 3);
        const meeting = await this.postRepository.create(payload).save();
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

  async createMeetingTags(meetingId: number, description?: string) {
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

  async sendMeetingInfoMail(user: UserProfile, meeting: Post, creator = false) {
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

  currentUserMeetingBaseValidator(userId: number, slug: string) {
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
        'meeting.userContactExclusive = true AND meeting.createdById = contact.userId AND contact.contactUserId = :userId',
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

  async currentUserRecordingValidator(userId: number, slug: string) {
    const result = await this.currentUserMeetingBaseValidator(
      userId,
      slug,
    ).getOne();

    if (!result)
      throw new NotFoundException('Meeting not found', 'MEETING_NOT_FOUND');

    if (!result.record)
      throw new BadRequestException(
        'Recording was not enabled for meeting',
        'MEETING_RECORDING_NOT_ENABLED',
      );

    return result;
  }

  async getMeetingRecordingList(slug: string, query: PaginationQuery) {
    return this.postVideoRepository
      .createQueryBuilder('meetingRecording')
      .where('meetingRecording.slug = :slug', { slug })
      .paginate(query);
  }

  currentUserJoinMeetingValidator(userId: number, slug: string) {
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

  async generateMeetingUrl(
    meeting: Post,
    user: UserProfile,
    moderator: boolean,
  ) {
    const token = await this.generateMeetingToken(meeting, user, moderator);

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
    meeting: Post,
    user: UserProfile,
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
        },
        group: 'a122-123-456-789',
      },
      moderator,
      exp: 1696284052,
      aud: JWT_APP_ID,
      iss: JWT_APP_ID,
      nbf: 1596197652,
      room: meeting.slug,
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
        'meeting.userContactExclusive',
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

  async getMeetingLogs(
    userId: number,
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
        'user.firstName',
        'user.lastName',
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
      meetingSlug: info.meetingTitle,
    });

    if (info.event === 'started') {
      await this.postRepository.update(
        { slug: info.meetingTitle },
        { conferenceStartDate: new Date(), conferenceEndDate: null },
      );
    }

    if (info.event === 'ended') {
      await this.postRepository.update(
        { slug: info.meetingTitle },
        { conferenceEndDate: new Date() },
      );
    }

    // user events
    if (['user_joined', 'user_left'].includes(info.event))
      meetingLog.userId = info.userId!;

    return meetingLog.save();
  }

  async getConferenceInfo(
    slug: string,
    userId: number,
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
        'meeting.userContactExclusive = true AND contact.userId = meeting.createdById AND contact.contactUserId = :userId',
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
        type: 'channel',
        channel: {
          name: meeting.channel.name,
          description: meeting.channel.description,
          topic: meeting.channel.topic,
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
        firstName: meeting.createdBy.firstName,
        lastName: meeting.createdBy.lastName,
        email: meeting.createdBy.email,
        userName: meeting.createdBy.userName,
        photoURL: meeting.createdBy.displayPhoto
          ? `${REACT_APP_SERVER_HOST}/v1/user/display-photo/${meeting.createdBy.displayPhoto}`
          : null,
      },
    };
  }
}

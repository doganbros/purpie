import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import crypto from 'crypto';

import { Meeting } from 'entities/Meeting.entity';
import { User } from 'entities/User.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { UserZone } from 'entities/UserZone.entity';
import { generateJWT } from 'helpers/jwt';
import { Brackets, DeepPartial, Repository } from 'typeorm';
import { UserPayload } from 'src/auth/interfaces/user.interface';
import { meetingConfigStringify } from 'helpers/utils';
import { Contact } from 'entities/Contact.entity';
import { PaginationQuery } from 'types/PaginationQuery';
import { Zone } from 'entities/Zone.entity';
import { Channel } from 'entities/Channel.entity';

const {
  JITSI_SECRET = '',
  JITSI_DOMAIN = 'https://meet.doganbros.com',
} = process.env;

@Injectable()
export class MeetingService {
  constructor(
    @InjectRepository(Meeting) private meetingRepository: Repository<Meeting>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserZone)
    private userZoneRepository: Repository<UserZone>,
    @InjectRepository(UserChannel)
    private userChannelRepository: Repository<UserChannel>,
  ) {}

  createNewMeeting(payload: DeepPartial<Meeting>) {
    return this.meetingRepository.create(payload).save();
  }

  currentUserJoinMeetingValidator(userId: number, slug: string) {
    return this.meetingRepository
      .createQueryBuilder('meeting')
      .leftJoin(
        UserZone,
        'user_zone',
        'meeting.zoneId = user_zone.zoneId AND user_zone.userId = :userId',
        { userId },
      )
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
            .orWhere('user_zone.zoneId is not null')
            .orWhere('user_channel.channelId is not null')
            .orWhere(
              'contact.contactUserId is not null or meeting.createdById = :userId',
              { userId },
            );
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

  async getCurrentUserZoneConfig(userId: number, zoneId: number) {
    return this.userZoneRepository
      .findOne({
        where: { userId, zoneId },
        relations: ['zone'],
      })
      .then((result) => result?.zone.zoneMeetingConfig);
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
        'createdBy.id',
        'createdBy.email',
        'createdBy.firstName',
        'createdBy.lastName',
      ]);
  }

  async getUserMeetings(userId: number, query: PaginationQuery) {
    return this.meetingSelections
      .leftJoin('meeting.createdBy', 'createdBy')
      .leftJoin(
        UserZone,
        'user_zone',
        'meeting.zoneId = user_zone.zoneId AND user_zone.userId = :userId',
        { userId },
      )
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
      .where('meeting.startDate >= now()')
      .andWhere(
        new Brackets((qb) => {
          qb.where('user_zone.zoneId is not null')
            .orWhere('user_channel.channelId is not null')
            .orWhere(
              'contact.contactUserId is not null or meeting.createdById = :userId',
              { userId },
            );
        }),
      )
      .paginate(query);
  }

  async getZoneMeetings(
    zoneId: number,
    userId: number,
    query: PaginationQuery,
  ) {
    return this.meetingSelections
      .leftJoin('meeting.createdBy', 'createdBy')
      .innerJoin(Zone, 'zone', 'meeting.zoneId = zone.id')
      .innerJoin(
        UserZone,
        'user_zone',
        'zone.id = user_zone.zoneId AND user_zone.userId = :userId',
        { userId },
      )
      .where('zone.id = :zoneId', { zoneId })
      .paginate(query);
  }

  async getChannelMeetings(
    channelId: number,
    userId: number,
    query: PaginationQuery,
  ) {
    return this.meetingSelections
      .leftJoin('meeting.createdBy', 'createdBy')
      .innerJoin(Channel, 'channel', 'meeting.channelId = channel.id')
      .innerJoin(
        UserChannel,
        'user_channel',
        'channel.id = user_channel.channelId AND user_channel.userId = :userId',
        { userId },
      )
      .where('channel.id = :channelId', { channelId })
      .paginate(query);
  }
}

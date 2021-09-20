import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { Contact } from 'entities/Contact.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { VideoPost } from 'entities/VideoPost.entity';
import { UserPayload } from 'src/auth/interfaces/user.interface';
import { MailService } from 'src/mail/mail.service';
import { Brackets, Repository } from 'typeorm';
import { PaginationQuery } from 'types/PaginationQuery';

const { REACT_APP_CLIENT_HOST } = process.env;

@Injectable()
export class VideoPostService {
  constructor(
    @InjectRepository(UserChannel)
    private userChannelRepository: Repository<UserChannel>,
    @InjectRepository(VideoPost)
    private videoPostRepository: Repository<VideoPost>,
    private mailService: MailService,
  ) {}

  async validateUserChannel(userId: number, channelId: number) {
    const userChannel = await this.userChannelRepository.findOne({
      channelId,
      userId,
    });
    if (!userChannel) throw new NotFoundException('User channel not found');
  }

  async createNewVideoPost(payload: Partial<VideoPost>) {
    return this.videoPostRepository.create(payload).save();
  }

  async sendVideoInfoMail(user: UserPayload, videoPost: VideoPost) {
    const context = {
      firstName: user.firstName,
      lastName: user.lastName,
      videoPost: {
        ...videoPost,
        createdOn: dayjs(videoPost.createdOn).format(
          'dddd D MMMM, YYYY h:mm A Z',
        ),
      },
      link: `${REACT_APP_CLIENT_HOST}/video/${videoPost.id}`,
    };
    return this.mailService.sendMailByView(
      user.email,
      'Octopus Video',
      'video-info',
      context,
    );
  }

  get videoPostSelection() {
    return this.videoPostRepository
      .createQueryBuilder('videoPost')
      .select([
        'videoPost.id',
        'videoPost.slug',
        'videoPost.description',
        'videoPost.public',
        'videoPost.userContactExclusive',
        'createdBy.id',
        'createdBy.firstName',
        'createdBy.lastName',
        'createdBy.userName',
      ])
      .innerJoin('videoPost.createdBy', 'createdBy')
      .leftJoin('videoPost.channel', 'channel');
  }

  async getVideoPostForUser(userId: number, videoPostId: number) {
    return this.videoPostSelection
      .addSelect([
        'channel.id',
        'channel.name',
        'channel.topic',
        'channel.description',
      ])
      .leftJoin(
        UserChannel,
        'user_channel',
        'user_channel.channelId = channel.id and user_channel.userId = :userId',
        { userId },
      )
      .leftJoin(
        Contact,
        'contact',
        'videoPost.userContactExclusive = true AND videoPost.createdById = contact.userId AND contact.contactUserId = :userId',
        { userId },
      )
      .where('videoPost.id = :videoPostId', { videoPostId })
      .andWhere(
        new Brackets((qb) => {
          qb.where('videoPost.public = true')
            .orWhere('user_channel.id is not null')
            .orWhere('videoPost.createdById = :userId', { userId })
            .orWhere('contact.contactUserId is not null');
        }),
      )
      .getOne();
  }

  async getPublicVideoPosts(query: PaginationQuery) {
    return this.videoPostSelection
      .where('videoPost.public = true')
      .orderBy('videoPost.id', 'DESC')
      .paginate(query);
  }

  async getUserVideoPosts(userId: number, query: PaginationQuery) {
    return this.videoPostSelection
      .addSelect([
        'channel.id',
        'channel.name',
        'channel.topic',
        'channel.description',
      ])
      .leftJoin(
        UserChannel,
        'user_channel',
        'user_channel.channelId = channel.id and user_channel.userId = :userId',
        { userId },
      )
      .leftJoin(
        Contact,
        'contact',
        'videoPost.userContactExclusive = true AND videoPost.createdById = contact.userId AND contact.contactUserId = :userId',
        { userId },
      )
      .where(
        new Brackets((qb) => {
          qb.where('videoPost.createdById = :userId', { userId })
            .orWhere('user_channel.id is not null')
            .orWhere('contact.contactUserId is not null');
        }),
      )
      .orderBy('videoPost.id', 'DESC')
      .paginate(query);
  }

  async getZoneVideoPosts(
    zoneId: number,
    userId: number,
    query: PaginationQuery,
  ) {
    return this.videoPostSelection
      .addSelect([
        'channel.id',
        'channel.name',
        'channel.topic',
        'channel.description',
      ])
      .leftJoin(
        UserChannel,
        'user_channel',
        'user_channel.channelId = channel.id and user_channel.userId = :userId',
        { userId },
      )
      .where('channel.zoneId = :zoneId', { zoneId })
      .andWhere('user_channel.id is not null')
      .orderBy('videoPost.id', 'DESC')
      .paginate(query);
  }

  async getChannelVideoPosts(
    channelId: number,
    userId: number,
    query: PaginationQuery,
  ) {
    return this.videoPostSelection
      .addSelect([
        'channel.id',
        'channel.name',
        'channel.topic',
        'channel.description',
      ])
      .innerJoin(
        UserChannel,
        'user_channel',
        'user_channel.channelId = channel.id and user_channel.userId = :userId',
        { userId },
      )
      .where('channel.id = :channelId', { channelId })
      .orderBy('videoPost.id', 'DESC')
      .paginate(query);
  }

  async removeVideoPost(userId: number, videoId: number) {
    return this.videoPostRepository
      .delete({
        id: videoId,
        createdById: userId,
      })
      .then((res) => !!res.affected);
  }
}

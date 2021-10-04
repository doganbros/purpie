import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { Contact } from 'entities/Contact.entity';
import { Post } from 'entities/Post.entity';
import { MeetingRecording } from 'entities/MeetingRecording.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { UserPayload } from 'src/auth/interfaces/user.interface';
import { MailService } from 'src/mail/mail.service';
import { Brackets, Repository } from 'typeorm';

const { REACT_APP_CLIENT_HOST } = process.env;

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(UserChannel)
    private userChannelRepository: Repository<UserChannel>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(MeetingRecording)
    private meetingRecordingRepository: Repository<MeetingRecording>,
    private mailService: MailService,
  ) {}

  async validateUserChannel(userId: number, channelId: number) {
    const userChannel = await this.userChannelRepository.findOne({
      channelId,
      userId,
    });
    if (!userChannel) throw new NotFoundException('User channel not found');
  }

  async createNewVideoPost(payload: Partial<Post>) {
    return this.postRepository.create(payload).save();
  }

  async sendVideoInfoMail(user: UserPayload, videoPost: Post) {
    const context = {
      firstName: user.firstName,
      lastName: user.lastName,
      videoPost: {
        ...videoPost,
        createdOn: dayjs(videoPost.createdOn).format(
          'dddd D MMMM, YYYY h:mm A Z',
        ),
      },
      link: `${REACT_APP_CLIENT_HOST}/video/${videoPost.slug}`,
    };
    return this.mailService.sendMailByView(
      user.email,
      'Octopus Video',
      'video-info',
      context,
    );
  }

  get videoPostSelection() {
    return this.postRepository
      .createQueryBuilder('videoPost')
      .select([
        'videoPost.id',
        'videoPost.slug',
        'videoPost.description',
        'videoPost.public',
        'videoPost.userContactExclusive',
        'tags.value',
        'createdBy.id',
        'createdBy.firstName',
        'createdBy.lastName',
        'createdBy.userName',
      ])
      .innerJoin('videoPost.createdBy', 'createdBy')
      .leftJoin('videoPost.tags', 'tags')
      .leftJoin('videoPost.channel', 'channel');
  }

  getVideoPostQuery(userId: number) {
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
      .where('videoPost.type = :type', { type: 'video' })
      .andWhere(
        new Brackets((qb) => {
          qb.where('videoPost.public = true')
            .orWhere('user_channel.id is not null')
            .orWhere('videoPost.createdById = :userId', { userId })
            .orWhere('contact.contactUserId is not null');
        }),
      );
  }

  async getVideoPostForUserById(userId: number, videoPostId: number) {
    return this.getVideoPostQuery(userId)
      .andWhere('videoPost.id = :videoPostId', { videoPostId })
      .getOne();
  }

  async getVideoPostForUserBySlug(userId: number, slug: string) {
    return this.getVideoPostQuery(userId)
      .andWhere('videoPost.slug = :slug', { slug })
      .getOne();
  }

  async removeVideoPost(userId: number, videoId: number) {
    return this.postRepository
      .delete({
        id: videoId,
        createdById: userId,
      })
      .then((res) => !!res.affected);
  }

  async setMeetingRecordingFile(slug: string, fileName: string) {
    const result = await this.postRepository.update(
      { slug, type: 'meeting' },
      { videoName: fileName },
    );

    if (result.affected) {
      return this.meetingRecordingRepository
        .create({
          meetingSlug: slug,
          fileName,
        })
        .save();
    }
    return null;
  }
}

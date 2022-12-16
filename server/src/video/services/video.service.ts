import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { Contact } from 'entities/Contact.entity';
import { Post } from 'entities/Post.entity';
import { PostTag } from 'entities/PostTag.entity';
import { PostVideo } from 'entities/PostVideo.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { parsePostTags } from 'helpers/utils';
import { UserProfile } from 'src/auth/interfaces/user.interface';
import { MailService } from 'src/mail/mail.service';
import { Brackets, Repository } from 'typeorm';
import { ErrorTypes } from '../../../types/ErrorTypes';

const { REACT_APP_CLIENT_HOST } = process.env;

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(UserChannel)
    private userChannelRepository: Repository<UserChannel>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(PostVideo)
    private postVideoRepository: Repository<PostVideo>,
    @InjectRepository(PostTag)
    private postTagRepository: Repository<PostTag>,
    private mailService: MailService,
  ) {}

  async validateUserChannel(
    userId: number,
    channelId: number,
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

  async createNewVideoPost(payload: Partial<Post>) {
    const videoPost = await this.postRepository.create(payload).save();
    // There could be multiple videos in the future
    await this.postVideoRepository
      .create({
        slug: payload.slug,
        fileName: payload.videoName!,
      })
      .save();

    return videoPost;
  }

  async createVideoTags(videoId: number, description?: string) {
    const tags = parsePostTags(description);

    if (tags?.length) {
      return this.postTagRepository.insert(
        tags.map((v) => ({ value: v, postId: videoId })),
      );
    }
    return null;
  }

  async sendVideoInfoMail(user: UserProfile, videoPost: Post) {
    const context = {
      fullName: user.fullName,
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
      'Purpie Video',
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
        'videoPost.videoName',
        'tags.value',
        'createdBy.id',
        'createdBy.fullName',
        'createdBy.userName',
      ])
      .innerJoin('videoPost.createdBy', 'createdBy')
      .leftJoin('videoPost.tags', 'tags')
      .leftJoin('videoPost.channel', 'channel');
  }

  getVideoPostQuery(userId: number) {
    return this.videoPostSelection
      .addSelect(['channel.id', 'channel.name', 'channel.description'])
      .leftJoin(
        UserChannel,
        'user_channel',
        'user_channel.channelId = channel.id and user_channel.userId = :userId',
        { userId },
      )
      .leftJoin(
        Contact,
        'contact',
        'videoPost.public = false AND videoPost.createdById = contact.userId AND contact.contactUserId = :userId',
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

  async setPostVideoFile(slug: string, fileName: string) {
    const post = await this.postRepository.findOne({ where: { slug } });

    if (!post) return null;

    post.videoName = fileName;
    await post.save();

    return this.postVideoRepository
      .create({ slug: post.slug, fileName })
      .save();
  }
}

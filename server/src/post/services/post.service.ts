import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { deleteObject } from 'config/s3-storage';
import dayjs from 'dayjs';
import { Contact } from 'entities/Contact.entity';
import { FeaturedPost } from 'entities/FeaturedPost.entity';
import { Post } from 'entities/Post.entity';
import { PostLike } from 'entities/PostLike.entity';
import { PostTag } from 'entities/PostTag.entity';
import { PostVideo } from 'entities/PostVideo.entity';
import { PostView } from 'entities/PostView.entity';
import { SavedPost } from 'entities/SavedPost.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { UserZone } from 'entities/UserZone.entity';
import { booleanValue, tsqueryParam } from 'helpers/utils';
import { Brackets, MoreThanOrEqual, Repository } from 'typeorm';
import { PaginationQuery, PaginationResponse } from 'types/PaginationQuery';
import { EditPostDto } from '../dto/edit-post.dto';
import { ListPostFeedQuery } from '../dto/list-post-feed.query';
import { VideoViewStats } from '../dto/video-view-stats.dto';
import { ErrorTypes } from '../../../types/ErrorTypes';
import { PostFolder } from '../../../entities/PostFolder.entity';

const {
  S3_BUCKET_NAME = '',
  S3_VIDEO_POST_DIR = '',
  S3_MEETING_RECORDING_DIR = '',
} = process.env;

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostView)
    private postViewRepository: Repository<PostView>,
    @InjectRepository(PostFolder)
    private folderRepository: Repository<PostFolder>,
    @InjectRepository(FeaturedPost)
    private featuredPostRepository: Repository<FeaturedPost>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(PostVideo)
    private postVideoRepository: Repository<PostVideo>,
  ) {}

  getOnePost(
    userId: string,
    postId: string | null,
    slug: string | null,
    preview = false,
  ) {
    return this.postRepository
      .createQueryBuilder('post')
      .select([
        'post.id',
        'post.title',
        'post.slug',
        'post.description',
        'post.startDate',
        'post.type',
        'post.public',
        'post.allowReaction',
        'post.allowComment',
      ])
      .leftJoin('post.channel', 'channel')
      .leftJoin('channel.zone', 'zone')
      .leftJoin(
        UserChannel,
        'user_channel',
        'user_channel.channelId = channel.id and user_channel.userId = :userId',
        { userId },
      )
      .leftJoin(
        UserZone,
        'user_zone',
        'user_zone.zoneId = zone.id and user_zone.userId = :userId',
        { userId },
      )
      .leftJoin(
        Contact,
        'contact',
        'contact.userId = post.createdById AND contact.contactUserId = :userId',
        { userId },
      )
      .where(postId ? 'post.id = :identity' : 'post.slug = :identity', {
        identity: postId || slug,
      })
      .andWhere(
        new Brackets((qb) => {
          qb.where('post.public = true').orWhere(
            'post.public = false and post.createdById = :userId',
            {
              userId,
            },
          );
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            new Brackets((qbi) => {
              qbi.orWhere('post.public = true');
              if (preview) {
                qbi.orWhere(
                  new Brackets((qbii) => {
                    qbii
                      .where(
                        new Brackets((qbiii) => {
                          qbiii
                            .where('zone.public = true')
                            .orWhere('user_zone.id is not null');
                        }),
                      )
                      .andWhere(
                        new Brackets((qbiii) => {
                          qbiii
                            .where('channel.public = true')
                            .orWhere('user_channel.id is not null');
                        }),
                      );
                  }),
                );
              } else {
                qbi.orWhere('user_channel.id is not null');
              }
              qbi.orWhere('contact.contactUserId is not null');
            }),
          );
        }),
      )
      .getOne();
  }

  async dropPostVideosByUser(userId: string, postId: string) {
    const filter: Record<string, any> = { createdById: userId };
    filter.id = postId;

    const post = await this.postRepository.findOne({ where: filter });

    if (!post)
      throw new NotFoundException(ErrorTypes.POST_NOT_FOUND, 'Post not found');

    const postVideos = await this.postVideoRepository.find({
      where: { slug: post.slug },
    });

    for (const postVideo of postVideos) {
      const location =
        post.type === 'meeting'
          ? `${S3_MEETING_RECORDING_DIR}${post.slug}/${postVideo.fileName}`
          : `${S3_VIDEO_POST_DIR}${postVideo.fileName}`;

      deleteObject({
        Key: location,
        Bucket: S3_BUCKET_NAME,
      });
      await this.postVideoRepository.delete({ id: postVideo.id });
    }

    post.videoName = null;

    await post.save();

    return true;
  }

  async removePost(userId: string, postId: string) {
    await this.dropPostVideosByUser(userId, postId);
    return this.postRepository.delete({ createdById: userId, id: postId });
  }

  async removePostVideo(postId: string, userId: string, videoName: string) {
    const post = await this.postRepository.findOne({
      where: { createdById: userId, id: postId },
    });

    if (!post) return null;

    await this.postVideoRepository.delete({
      slug: post.slug,
      fileName: videoName,
    });

    const location =
      post.type === 'meeting'
        ? `${S3_MEETING_RECORDING_DIR}${post.slug}/${videoName}`
        : `${S3_VIDEO_POST_DIR}${videoName}`;

    deleteObject({
      Key: location,
      Bucket: S3_BUCKET_NAME,
    });

    if (post.videoName === videoName) {
      post.videoName = null;
      await post.save();
    }

    return true;
  }

  async getPostVideoForUserBySlugAndFileName(
    userId: string,
    slug: string,
    fileName: string,
  ) {
    const post = await this.getOnePost(userId, null, slug, true);

    if (!post)
      throw new NotFoundException(
        ErrorTypes.VIDEO_NOT_FOUND,
        'Video not found',
      );

    return this.postVideoRepository
      .createQueryBuilder('postVideo')
      .select([
        'postVideo.id',
        'postVideo.slug',
        'postVideo.fileName',
        'post.type',
      ])
      .innerJoin('postVideo.post', 'post')
      .where('postVideo.slug = :slug', { slug })
      .andWhere('postVideo.fileName = :fileName', { fileName })
      .getOne();
  }

  basePost(query: Partial<ListPostFeedQuery>, userId: string) {
    const builder = this.postRepository
      .createQueryBuilder('post')
      .addSelect(
        (sq) =>
          sq
            .select('count(*) > 0')
            .from(PostLike, 'user_post_like')
            .where('user_post_like.postId = post.id')
            .andWhere('user_post_like.positive = true')
            .andWhere('user_post_like.userId = :currentUserId'),
        'post_liked',
      )
      .addSelect(
        (sq) =>
          sq
            .select('count(*) > 0')
            .from(PostLike, 'user_post_like')
            .where('user_post_like.postId = post.id')
            .andWhere('user_post_like.positive = false')
            .andWhere('user_post_like.userId = :currentUserId'),
        'post_disliked',
      )
      .addSelect(
        (sq) =>
          sq
            .select('count(*) > 0')
            .from(SavedPost, 'user_saved_post')
            .where('user_saved_post.postId = post.id')
            .andWhere('user_saved_post.userId = :currentUserId'),
        'post_saved',
      )
      .addSelect([
        'postReaction.likesCount',
        'postReaction.viewsCount',
        'postReaction.dislikesCount',
        'postReaction.commentsCount',
        'postReaction.liveStreamViewersCount',
        'post.record',
        'createdBy.id',
        'createdBy.email',
        'createdBy.fullName',
        'createdBy.displayPhoto',
        'createdBy.userName',
      ])
      .setParameter('currentUserId', userId)
      .innerJoin('post.createdBy', 'createdBy')
      .leftJoin('post.postReaction', 'postReaction')
      .where(
        new Brackets((qb) => {
          qb.where('post.public = true').orWhere(
            'post.public = false and post.createdById = :currentUserId',
          );
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            new Brackets((qbi) => {
              qbi
                .where('post.type = :meetingType', { meetingType: 'meeting' })
                .andWhere(
                  new Brackets((qbii) => {
                    qbii.where('post.conferenceEndDate is null').orWhere(
                      new Brackets((qbiii) => {
                        qbiii
                          .where('post.conferenceEndDate is not null')
                          .andWhere('post.record');
                      }),
                    );
                  }),
                );
            }),
          ).orWhere('post.type = :videoType', {
            videoType: 'video',
          });
        }),
      );

    if (query.userName)
      builder.andWhere('post.createdById = :createdById', {
        createdById: query.userName,
      });
    if (query.postType)
      builder.andWhere('post.type = :postType', {
        postType: query.postType,
      });
    if (query.streaming)
      builder.andWhere('post.streaming = :streaming', {
        streaming: booleanValue(query.streaming),
      });
    if (query.tags) {
      const tags = query.tags.split(',').map((v) => v.trim());

      if (tags.length) {
        builder.andWhere((qb) => {
          const subQuery = qb
            .subQuery()
            .select('postTag.postId')
            .from(PostTag, 'postTag')
            .where('postTag.value IN (:...postTagValues)', {
              postTagValues: tags,
            })
            .andWhere('postTag.postId = post.id')
            .limit(1)
            .getQuery();

          return `post.id = ${subQuery}`;
        });
      }
    }

    if (query.sortBy === 'popularity')
      builder
        .orderBy('postReaction.likesCount', query.sortDirection ?? 'DESC')
        .addOrderBy('postReaction.commentsCount', query.sortDirection ?? 'DESC')
        .addOrderBy('post.id', query.sortDirection ?? 'DESC');
    else builder.orderBy('post.id', query.sortDirection ?? 'DESC');

    if (query.searchTerm?.trim()) {
      builder.setParameter('searchTerm', tsqueryParam(query.searchTerm));
      builder.addSelect(
        `ts_rank(post.search_document, to_tsquery('simple', :searchTerm))`,
        'search_rank',
      );
      builder.andWhere(
        `post.search_document @@ to_tsquery('simple', :searchTerm)`,
      );

      builder.addOrderBy('search_rank', 'DESC');
    }

    if (query.folderId) {
      builder.andWhere(
        new Brackets((qb) => {
          const postFolderQb = this.folderRepository
            .createQueryBuilder('folder')
            .select('folder.id')
            .innerJoin('folder.folderItems', 'folderItems')
            .where('folder.id = :folderId')
            .andWhere('folderItems.postId = post.id')
            .limit(1)
            .getQuery();

          qb.where(`EXISTS (${postFolderQb})`, {
            folderId: Number(query.folderId),
          });
        }),
      );
    }

    return builder;
  }

  baseChannelPosts(query: PaginationQuery, userId: string) {
    return this.basePost(query, userId)
      .addSelect([
        'zone.id',
        'zone.name',
        'zone.subdomain',
        'zone.public',
        'channel.id',
        'channel.name',
        'channel.description',
        'channel.public',
      ])
      .innerJoin('post.channel', 'channel')
      .innerJoin('channel.zone', 'zone')
      .leftJoin(
        UserZone,
        'user_zone',
        'user_zone.zoneId = zone.id and user_zone.userId = :userId',
        { userId },
      )
      .leftJoin(
        UserChannel,
        'user_channel',
        'user_channel.channelId = channel.id and user_channel.userId = :userId',
        { userId },
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            new Brackets((qbi) => {
              qbi
                .where('zone.public = true')
                .orWhere('user_zone.id is not null');
            }),
          ).andWhere(
            new Brackets((qbi) => {
              qbi
                .where('channel.public = true')
                .orWhere('user_channel.id is not null');
            }),
          );
        }),
      );
  }

  getUserFeedSelection(
    userId: string,
    query: Partial<ListPostFeedQuery>,
    includePublic = false,
    includePublicZoneChannel = false,
    createdByUserId?: string,
  ) {
    const baseSelection = this.basePost(query, userId)
      .addSelect([
        'zone.id',
        'zone.name',
        'zone.subdomain',
        'zone.public',
        'channel.id',
        'channel.name',
        'channel.description',
        'channel.public',
      ])
      .leftJoin('post.channel', 'channel')
      .leftJoin('channel.zone', 'zone')
      .leftJoin(
        UserChannel,
        'user_channel',
        'user_channel.channelId = channel.id and user_channel.userId = :userId',
        { userId },
      )
      .leftJoin(
        UserZone,
        'user_zone',
        'user_zone.zoneId = zone.id and user_zone.userId = :userId',
        { userId },
      )
      .leftJoin(
        Contact,
        'contact',
        'contact.userId = post.createdById AND contact.contactUserId = :userId',
        { userId },
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            new Brackets((qbi) => {
              qbi.where('contact.contactUserId is not null');
              if (includePublic) qbi.orWhere('post.public = true');

              if (includePublicZoneChannel)
                qbi.orWhere(
                  new Brackets((qbii) => {
                    qbii
                      .where(
                        new Brackets((qbiii) => {
                          qbiii
                            .where('zone.public = true')
                            .orWhere('user_zone.id is not null');
                        }),
                      )
                      .andWhere(
                        new Brackets((qbiii) => {
                          qbiii
                            .where('channel.public = true')
                            .orWhere('user_channel.id is not null');
                        }),
                      );
                  }),
                );
              else qbi.orWhere('user_channel.id is not null');

              if (createdByUserId) query.following = 'false';

              const following = booleanValue(query.following);

              if (!following)
                qbi.orWhere('post.createdById = :userId', { userId });
            }),
          );
        }),
      );

    if (createdByUserId)
      baseSelection.andWhere('post.createdById = :createdByUserId', {
        createdByUserId,
      });

    return baseSelection;
  }

  getPostById(userId: string, postId: string) {
    return this.getUserFeedSelection(userId, {}, true, true)
      .andWhere('post.id = :postId', { postId })
      .getOne();
  }

  async getFeedList(
    query: ListPostFeedQuery,
    userId: string,
  ): Promise<PaginationResponse<Post>> {
    if (query.userId)
      return this.getUserFeedSelection(
        query.userId,
        query,
        true,
        true,
        userId,
      ).paginate(query);

    if (query.public)
      return this.basePost(query, userId)
        .andWhere('post.public = true')
        .paginate(query);
    if (query.zoneId)
      return this.baseChannelPosts(query, userId)
        .andWhere('channel.zoneId = :zoneId', { zoneId: query.zoneId })
        .paginate(query);
    if (query.channelId)
      return this.baseChannelPosts(query, userId)
        .andWhere('channel.id = :channelId', {
          channelId: query.channelId,
        })
        .paginate(query);
    if (query.following && booleanValue(query.following))
      return this.getUserFeedSelection(userId, query, false, false).paginate(
        query,
      );

    return this.getUserFeedSelection(userId, query, true, true).paginate(query);
  }

  async getFeaturedPost(userId: string, currentUserId: string) {
    const featuredPost = await this.featuredPostRepository
      .createQueryBuilder('featuredPost')
      .select(['featuredPost.id', 'featuredPost.createdOn'])
      .innerJoin('featuredPost.post', 'post')
      .where('featuredPost.userId = :userId', { userId })
      .getOne();

    if (!featuredPost) return null;

    const result = { ...featuredPost };

    const post = await this.getPostById(currentUserId, featuredPost.id);

    if (!post) return null;

    result.post = post;

    return post;
  }

  editPost(postId: string, userId: string, payload: EditPostDto) {
    const editPayload: Partial<EditPostDto> = {};

    if (payload.title) editPayload.title = payload.title;
    if (payload.description) editPayload.description = payload.description;
    editPayload.public = payload.public;

    if (!Object.keys(editPayload).length)
      throw new BadRequestException(
        ErrorTypes.EDIT_POST_PAYLOAD_EMPTY,
        'Edit Payload empty',
      );

    return this.postRepository.update(
      { id: postId, createdById: userId },
      editPayload,
    );
  }

  async videoViewStats(userId: string, payload: VideoViewStats) {
    const viewDate = new Date();
    const { VIDEO_VIEW_COUNT_HOUR_INTERVAL = 12 } = process.env;

    const lastIntervalExists = await this.postViewRepository.findOne({
      where: {
        userId,
        createdOn: MoreThanOrEqual(
          dayjs()
            .subtract(+VIDEO_VIEW_COUNT_HOUR_INTERVAL, 'hours')
            .toDate(),
        ),
      },
    });

    return this.postViewRepository
      .create({
        postId: payload.postId,
        userId,
        startedFrom: payload.startedFrom,
        endedAt: payload.endedAt,
        createdOn: viewDate,
        shouldCount: !lastIntervalExists,
      })
      .save();
  }

  async validatePost(userId: string, postId: string) {
    const post = await this.getOnePost(userId, postId, null, true);

    if (!post)
      throw new NotFoundException(
        ErrorTypes.POST_NOT_FOUND,
        'Post not found or unauthorized',
      );

    return post;
  }
}

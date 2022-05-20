import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { deleteObject } from 'config/s3-storage';
import dayjs from 'dayjs';
import { Contact } from 'entities/Contact.entity';
import { Post } from 'entities/Post.entity';
import { PostComment } from 'entities/PostComment.entity';
import { PostCommentLike } from 'entities/PostCommentLike.entity';
import { PostLike } from 'entities/PostLike.entity';
import { PostTag } from 'entities/PostTag.entity';
import { PostVideo } from 'entities/PostVideo.entity';
import { PostView } from 'entities/PostView.entity';
import { SavedPost } from 'entities/SavedPost.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { UserZone } from 'entities/UserZone.entity';
import { booleanValue, tsqueryParam } from 'helpers/utils';
import { Brackets, IsNull, MoreThanOrEqual, Repository } from 'typeorm';
import { PaginationQuery } from 'types/PaginationQuery';
import { CreatePostCommentLikeDto } from '../dto/create-post-comment-like.dto';
import { CreatePostCommentDto } from '../dto/create-post-comment.dto';
import { CreatePostLikeDto } from '../dto/create-post-like.dto';
import { CreateSavedPostDto } from '../dto/create-saved-post.dto';
import { EditPostDto } from '../dto/edit-post.dto';
import { ListPostFeedQuery } from '../dto/list-post-feed.query';
import { VideoViewStats } from '../dto/video-view-stats.dto';

const {
  S3_VIDEO_BUCKET_NAME = '',
  S3_VIDEO_POST_DIR = '',
  S3_VIDEO_MEETING_RECORDING_DIR = '',
} = process.env;

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostView)
    private postViewRepository: Repository<PostView>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(PostLike)
    private postLikeRepository: Repository<PostLike>,
    @InjectRepository(PostComment)
    private postCommentRepository: Repository<PostComment>,
    @InjectRepository(PostCommentLike)
    private postCommentLikeRepository: Repository<PostCommentLike>,
    @InjectRepository(SavedPost)
    private savedPostRepository: Repository<SavedPost>,
    @InjectRepository(PostVideo)
    private postVideoRepository: Repository<PostVideo>,
  ) {}

  getOnePost(userId: number, identity: number | string, preview = false) {
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
        'post.userContactExclusive = true AND contact.userId = post.createdById AND contact.contactUserId = :userId',
        { userId },
      )
      .where(
        `${
          typeof identity === 'string'
            ? 'post.slug = :identity'
            : 'post.id = :identity'
        }`,
        { identity },
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

  createPostComment(userId: number, info: CreatePostCommentDto) {
    return this.postCommentRepository
      .create({
        comment: info.comment,
        userId,
        parentId: info.parentId || null,
        postId: info.postId,
      })
      .save();
  }

  createPostLike(userId: number, info: CreatePostLikeDto) {
    return this.postLikeRepository
      .create({
        userId,
        postId: info.postId,
      })
      .save();
  }

  createPostCommentLike(userId: number, info: CreatePostCommentLikeDto) {
    return this.postCommentLikeRepository
      .create({
        userId,
        postId: info.postId,
        commentId: info.postCommentId,
      })
      .save();
  }

  getPostCommentLikeCount(postId: number, commentId: number) {
    return this.postCommentLikeRepository.count({
      where: { postId, commentId },
    });
  }

  getPostLikeCount(postId: number) {
    return this.postLikeRepository.count({ where: { postId } });
  }

  getPostCommentCount(postId: number, parentId?: number | null) {
    return this.postCommentRepository.count({
      where: {
        postId,
        parentId: parentId || IsNull(),
      },
    });
  }

  getPostCommentLikes(
    postId: number,
    commentId: number,
    query: PaginationQuery,
  ) {
    return this.postCommentLikeRepository
      .createQueryBuilder('postCommentLike')
      .select([
        'postCommentLike.id',
        'postCommentLike.createdOn',
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.userName',
        'user.email',
      ])
      .innerJoin('postCommentLike.user', 'user')
      .where('postCommentLike.postId = :postId', { postId })
      .andWhere('postCommentLike.commentId = :commentId', { commentId })
      .paginate(query);
  }

  getPostLikes(postId: number, query: PaginationQuery) {
    return this.postLikeRepository
      .createQueryBuilder('postLike')
      .select([
        'postLike.id',
        'postLike.createdOn',
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.userName',
        'user.email',
      ])
      .innerJoin('postLike.user', 'user')
      .where('postLike.postId = :postId', { postId })
      .paginate(query);
  }

  getPostComments(
    userId: number,
    postId: number,
    query: PaginationQuery,
    params: Record<string, any>,
  ) {
    return this.postCommentRepository
      .createQueryBuilder('postComment')
      .addSelect([
        'postComment.id',
        'postComment.comment',
        'postComment.parentId',
        'postComment.createdOn',
        'postComment.updatedOn',
        'postComment.edited',
        'postComment.publishedInLiveStream',
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.userName',
        'user.email',
      ])
      .addSelect(
        (sq) =>
          sq
            .select('cast(count(*) as int)')
            .from(PostComment, 'postReply')
            .where('postReply.postId = postComment.postId')
            .andWhere('postReply.parentId = postComment.id'),
        'postComment_replyCount',
      )
      .addSelect(
        (sq) =>
          sq
            .select('cast(count(*) as int)')
            .from(PostCommentLike, 'postCommentLike')
            .where('postCommentLike.commentId = postComment.id'),
        'postComment_likesCount',
      )
      .addSelect(
        (sq) =>
          sq
            .select('count(*) > 0')
            .from(PostCommentLike, 'user_post_comment_like')
            .where('user_post_comment_like.postId = postComment.postId')
            .andWhere('user_post_comment_like.commentId = postComment.id')
            .andWhere('user_post_comment_like.userId = :currentUserId', {
              currentUserId: userId,
            }),
        'postComment_liked',
      )
      .innerJoin('postComment.user', 'user')
      .where('postComment.postId = :postId', { postId })
      .andWhere(
        params.parentId
          ? 'postComment.parentId = :parentId'
          : 'postComment.parentId is null',
        {
          parentId: Number.parseInt(params.parentId, 10),
        },
      )
      .paginate(query);
  }

  async dropPostVideosByUser(userId: number, identity: string | number) {
    const filter: Record<string, any> = { createdById: userId };
    if (typeof identity === 'string') filter.slug = identity;
    else filter.id = identity;

    const post = await this.postRepository.findOne({ where: filter });

    if (!post) throw new NotFoundException('Post not found', 'POST_NOT_FOUND');

    const postVideos = await this.postVideoRepository.find({
      where: { slug: post.slug },
    });

    for (const postVideo of postVideos) {
      const location =
        post.type === 'meeting'
          ? `${S3_VIDEO_MEETING_RECORDING_DIR}${post.slug}/${postVideo.fileName}`
          : `${S3_VIDEO_POST_DIR}${postVideo.fileName}`;

      deleteObject({
        Key: location,
        Bucket: S3_VIDEO_BUCKET_NAME,
      });
      await this.postVideoRepository.delete({ id: postVideo.id });
    }

    post.videoName = null;

    await post.save();

    return true;
  }

  async removePost(userId: number, postId: number) {
    await this.dropPostVideosByUser(userId, postId);
    return this.postRepository.delete({ createdById: userId, id: postId });
  }

  async removePostVideo(postId: number, userId: number, videoName: string) {
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
        ? `${S3_VIDEO_MEETING_RECORDING_DIR}${post.slug}/${videoName}`
        : `${S3_VIDEO_POST_DIR}${videoName}`;

    deleteObject({
      Key: location,
      Bucket: S3_VIDEO_BUCKET_NAME,
    });

    if (post.videoName === videoName) {
      post.videoName = null;
      await post.save();
    }

    return true;
  }

  removePostCommentLike(userId: number, commentId: number) {
    return this.postCommentLikeRepository.delete({ userId, commentId });
  }

  removePostLike(userId: number, postId: number) {
    return this.postLikeRepository.delete({ userId, postId });
  }

  removePostComment(userId: number, commentId: number) {
    return this.postCommentRepository.delete({ userId, id: commentId });
  }

  editPostComment(userId: number, commentId: number, comment: string) {
    return this.postCommentRepository.update(
      { userId, id: commentId },
      { comment, edited: true, updatedOn: new Date() },
    );
  }

  createSavedPost(userId: number, info: CreateSavedPostDto) {
    return this.savedPostRepository
      .create({
        userId,
        postId: info.postId,
      })
      .save();
  }

  removeSavedPost(userId: number, postId: number) {
    return this.savedPostRepository.delete({ userId, postId });
  }

  getSavedPosts(userId: number, query: PaginationQuery) {
    return this.savedPostRepository
      .createQueryBuilder('savedPost')
      .addSelect([
        'savedPost.id',
        'savedPost.createdOn',
        'post.id',
        'post.title',
        'post.slug',
        'post.description',
        'post.startDate',
        'post.type',
        'post.createdOn',
        'post.public',
        'post.videoName',
        'post.userContactExclusive',
        'post.channelId',
        'post.liveStream',
        'post.streaming',
        'post.record',
        'postReaction.likesCount',
        'postReaction.commentsCount',
        'postReaction.viewsCount',
        'createdBy.id',
        'createdBy.email',
        'createdBy.firstName',
        'createdBy.lastName',
      ])
      .addSelect(
        (sq) =>
          sq
            .select('count(*) > 0')
            .from(PostLike, 'user_post_like')
            .where('user_post_like.postId = post.id')
            .andWhere('user_post_like.userId = :currentUserId'),
        'post_liked',
      )
      .setParameter('currentUserId', userId)
      .innerJoin('savedPost.post', 'post')
      .innerJoin('post.createdBy', 'createdBy')
      .leftJoin('post.postReaction', 'postReaction')
      .leftJoin('post.channel', 'channel')
      .leftJoin(
        UserChannel,
        'user_channel',
        'user_channel.channelId = channel.id and user_channel.userId = :userId',
        { userId },
      )
      .leftJoin('channel.zone', 'zone')
      .leftJoin(
        Contact,
        'contact',
        'post.userContactExclusive = true AND contact.userId = post.createdById AND contact.contactUserId = :userId',
        { userId },
      )
      .where('savedPost.userId = :userId', { userId })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            new Brackets((qbi) => {
              qbi
                .orWhere('post.public = true')
                .orWhere('user_channel.id is not null')
                .orWhere('contact.contactUserId is not null');
            }),
          );
        }),
      )

      .orderBy('savedPost.id', 'DESC')
      .paginate(query);
  }

  async getPostVideoForUserBySlugAndFileName(
    userId: number,
    slug: string,
    fileName: string,
  ) {
    const post = await this.getOnePost(userId, slug, true);

    if (!post)
      throw new NotFoundException('Video not found', 'VIDEO_NOT_FOUND');

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

  basePost(query: Partial<ListPostFeedQuery>, userId: number) {
    const builder = this.postRepository
      .createQueryBuilder('post')
      .addSelect(
        (sq) =>
          sq
            .select('count(*) > 0')
            .from(PostLike, 'user_post_like')
            .where('user_post_like.postId = post.id')
            .andWhere('user_post_like.userId = :currentUserId'),
        'post_liked',
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
        'postReaction.commentsCount',
        'post.record',
        'createdBy.id',
        'createdBy.email',
        'createdBy.firstName',
        'createdBy.lastName',
      ])

      .setParameter('currentUserId', userId)
      .innerJoin('post.createdBy', 'createdBy')
      .leftJoin('post.postReaction', 'postReaction')
      .where(
        new Brackets((qb) => {
          qb.where(
            new Brackets((qbi) => {
              qbi
                .where('post.type = :meetingType', { meetingType: 'meeting' })
                .andWhere(
                  new Brackets((qbii) => {
                    qbii
                      .where('post.conferenceEndDate is null')
                      .orWhere('post.videoName is not null');
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

    return builder;
  }

  getUserFeedSelection(
    userId: number,
    query: Partial<ListPostFeedQuery>,
    includePublic = false,
    includePublicZoneChannel = false,
    createdByUserId?: number,
  ) {
    const baseSelection = this.basePost(query, userId)
      .addSelect([
        'zone.id',
        'zone.name',
        'zone.subdomain',
        'zone.public',
        'channel.id',
        'channel.name',
        'channel.topic',
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
        'post.userContactExclusive = true AND contact.userId = post.createdById AND contact.contactUserId = :userId',
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

  getPublicUserFeed(
    currentUserId: number,
    createdByUserId: number,
    query: ListPostFeedQuery,
  ) {
    return this.getUserFeedSelection(
      currentUserId,
      query,
      true,
      true,
      createdByUserId,
    ).paginate(query);
  }

  getUserFeed(userId: number, query: ListPostFeedQuery) {
    return this.getUserFeedSelection(userId, query).paginate(query);
  }

  getPostById(userId: number, postId: number) {
    return this.getUserFeedSelection(userId, {}, true, true)
      .andWhere('post.id = :postId', { postId })
      .getOne();
  }

  baseChannelPosts(query: PaginationQuery, userId: number) {
    return this.basePost(query, userId)
      .addSelect([
        'zone.id',
        'zone.name',
        'zone.subdomain',
        'zone.public',
        'channel.id',
        'channel.name',
        'channel.topic',
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

  getZoneFeed(zoneId: number, userId: number, query: ListPostFeedQuery) {
    return this.baseChannelPosts(query, userId)
      .andWhere('channel.zoneId = :zoneId', { zoneId })
      .paginate(query);
  }

  getChannelFeed(channelId: number, userId: number, query: PaginationQuery) {
    return this.baseChannelPosts(query, userId)
      .andWhere('channel.id = :channelId', { channelId })
      .paginate(query);
  }

  getPublicFeed(query: PaginationQuery, userId: number) {
    return this.basePost(query, userId)
      .andWhere('post.public = true')
      .paginate(query);
  }

  editPost(postId: number, userId: number, payload: EditPostDto) {
    const editPayload: Partial<EditPostDto> = {};

    if (payload.title) editPayload.title = payload.title;
    if (payload.description) editPayload.description = payload.description;

    if (!Object.keys(editPayload).length)
      throw new BadRequestException('Edit Payload empty', 'EDIT_PAYLOAD_EMPTY');

    return this.postRepository.update(
      { id: postId, createdById: userId },
      editPayload,
    );
  }

  async videoViewStats(userId: number, payload: VideoViewStats) {
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
}

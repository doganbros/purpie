import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from 'entities/Contact.entity';
import { Post } from 'entities/Post.entity';
import { PostComment } from 'entities/PostComment.entity';
import { PostLike } from 'entities/PostLike.entity';
import { PostTag } from 'entities/PostTag.entity';
import { PostVideo } from 'entities/PostVideo.entity';
import { SavedPost } from 'entities/SavedPost.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { booleanValue } from 'helpers/utils';
import { Brackets, IsNull, Repository } from 'typeorm';
import { PaginationQuery } from 'types/PaginationQuery';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { CreatePostLikeDto } from './dto/create-post-like.dto';
import { CreateSavedPostDto } from './dto/create-saved-post.dto';
import { ListPostFeedQuery } from './dto/list-post-feed.query';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(PostLike)
    private postLikeRepository: Repository<PostLike>,
    @InjectRepository(PostComment)
    private postCommentRepository: Repository<PostComment>,
    @InjectRepository(SavedPost)
    private savedPostRepository: Repository<SavedPost>,
    @InjectRepository(PostVideo)
    private postVideoRepository: Repository<PostVideo>,
  ) {}

  getOnePost(userId: number, identity: number | string) {
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
      .leftJoin(
        UserChannel,
        'userChannel',
        'userChannel.channelId = post.channelId and userChannel.userId = :userId',
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
              qbi
                .orWhere('post.public = true')
                .orWhere('userChannel.id is not null')
                .orWhere('contact.contactUserId is not null');
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
    postId: number,
    query: PaginationQuery,
    params: Record<string, any>,
  ) {
    return this.postCommentRepository
      .createQueryBuilder('postComment')
      .select([
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

  removePostLike(userId: number, likeId: number) {
    return this.postLikeRepository.delete({ userId, id: likeId });
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

  removeSavedPost(userId: number, savedPostId: number) {
    return this.savedPostRepository.delete({ userId, id: savedPostId });
  }

  getSavedPosts(userId: number, query: PaginationQuery) {
    return this.savedPostRepository
      .createQueryBuilder('savedPost')
      .select([
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
        'post.record',
        'createdBy.id',
        'createdBy.email',
        'createdBy.firstName',
        'createdBy.lastName',
      ])
      .addSelect(
        (sq) =>
          sq
            .select('count(*)')
            .from(PostLike, 'post_like')
            .where('post_like.postId = post.id'),
        'post_likesCount',
      )
      .addSelect(
        (sq) =>
          sq
            .select('count(*)')
            .from(PostComment, 'post_comment')
            .where('post_comment.postId = post.id'),
        'post_commentsCount',
      )
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
      .leftJoin('post.createdBy', 'createdBy')
      .leftJoin('post.channel', 'channel')
      .leftJoin(
        UserChannel,
        'userChannel',
        'userChannel.channelId = channel.id and userChannel.userId = :userId',
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
                .orWhere('userChannel.id is not null')
                .orWhere('contact.contactUserId is not null');
            }),
          );
        }),
      )

      .orderBy('savedPost.id', 'DESC')
      .paginateRawAndEntities(
        {
          otherFields: ['likesCount', 'commentsCount', 'liked'],
          primaryTableAliasName: 'savedPost',
          primaryColumnName: 'id',
        },
        query,
      );
  }

  async getPostVideoForUserBySlugAndFileName(
    userId: number,
    slug: string,
    fileName: string,
  ) {
    const post = await this.getOnePost(userId, slug);

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
      .select([
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
        'post.record',
        'createdBy.id',
        'createdBy.email',
        'createdBy.firstName',
        'createdBy.lastName',
      ])
      .addSelect(
        (sq) =>
          sq
            .select('count(*)')
            .from(PostLike, 'post_like')
            .where('post_like.postId = post.id'),
        'post_likesCount',
      )
      .addSelect(
        (sq) =>
          sq
            .select('count(*)')
            .from(PostComment, 'post_comment')
            .where('post_comment.postId = post.id'),
        'post_commentsCount',
      )
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

      .setParameter('currentUserId', userId)
      .leftJoin('post.createdBy', 'createdBy')
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
        .orderBy('"post_likesCount"', query.sortDirection ?? 'DESC')
        .addOrderBy('"post_commentsCount"', query.sortDirection ?? 'DESC')
        .addOrderBy('post.id', query.sortDirection ?? 'DESC');
    else builder.orderBy('post.id', query.sortDirection ?? 'DESC');

    return builder;
  }

  getUserFeedSelection(
    userId: number,
    query: Partial<ListPostFeedQuery>,
    includePublic = false,
  ) {
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
      .leftJoin('post.channel', 'channel')
      .leftJoin(
        UserChannel,
        'userChannel',
        'userChannel.channelId = channel.id and userChannel.userId = :userId',
        { userId },
      )
      .leftJoin('channel.zone', 'zone')
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
              if (includePublic) qbi.orWhere('post.public = true');
              qbi
                .orWhere('userChannel.id is not null')
                .orWhere('contact.contactUserId is not null')
                .orWhere('post.createdById = :userId', { userId });
            }),
          );
        }),
      );
  }

  getUserFeed(userId: number, query: ListPostFeedQuery) {
    return this.getUserFeedSelection(userId, query).paginateRawAndEntities(
      {
        otherFields: ['commentsCount', 'likesCount', 'liked', 'saved'],
        primaryColumnName: 'id',
        primaryTableAliasName: 'post',
      },
      query,
    );
  }

  getPostById(userId: number, postId: number) {
    return this.getUserFeedSelection(userId, {}, true)
      .andWhere('post.id = :postId', { postId })
      .getRawOneAndEntity(
        ['commentsCount', 'likesCount', 'liked', 'saved'],
        'post',
      );
  }

  getZoneFeed(zoneId: number, userId: number, query: ListPostFeedQuery) {
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
      .innerJoin(
        UserChannel,
        'user_channel',
        'user_channel.channelId = channel.id and user_channel.userId = :userId',
        { userId },
      )
      .innerJoin('channel.zone', 'zone')
      .andWhere('channel.zoneId = :zoneId', { zoneId })
      .paginateRawAndEntities(
        {
          otherFields: ['commentsCount', 'likesCount', 'liked', 'saved'],
          primaryColumnName: 'id',
          primaryTableAliasName: 'post',
        },
        query,
      );
  }

  getChannelFeed(channelId: number, userId: number, query: PaginationQuery) {
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
      ])
      .innerJoin('post.channel', 'channel')
      .innerJoin('channel.zone', 'zone')
      .innerJoin(
        UserChannel,
        'userChannel',
        'userChannel.channelId = :channelId and userChannel.userId = :userId',
        { userId, channelId },
      )
      .paginateRawAndEntities(
        {
          otherFields: ['commentsCount', 'likesCount', 'liked', 'saved'],
          primaryColumnName: 'id',
          primaryTableAliasName: 'post',
        },
        query,
      );
  }

  getPublicFeed(query: PaginationQuery, userId: number) {
    return this.basePost(query, userId)
      .andWhere('post.public = true')
      .paginateRawAndEntities(
        {
          otherFields: ['commentsCount', 'likesCount', 'liked', 'saved'],
          primaryColumnName: 'id',
          primaryTableAliasName: 'post',
        },
        query,
      );
  }
}

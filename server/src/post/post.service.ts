import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from 'entities/Contact.entity';
import { Post } from 'entities/Post.entity';
import { PostComment } from 'entities/PostComment.entity';
import { PostLike } from 'entities/PostLike.entity';
import { SavedPost } from 'entities/SavedPost.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { Brackets, IsNull, Repository } from 'typeorm';
import { PaginationQuery } from 'types/PaginationQuery';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { CreatePostLikeDto } from './dto/create-post-like.dto';
import { CreateSavedPostDto } from './dto/create-saved-post.dto';

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
  ) {}

  getPostById(userId: number, postId: number) {
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
      .where('post.id = :postId', { postId })
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
        'post.public',
        'post.videoName',
        'post.createdOn',
        'tags.value',
        'post.userContactExclusive',
        'post.channelId',
        'post.liveStream',
        'post.record',
        'createdBy.id',
        'createdBy.email',
        'createdBy.firstName',
        'createdBy.lastName',
        'zone.id',
        'zone.name',
        'zone.subdomain',
        'zone.public',
        'channel.id',
        'channel.name',
        'channel.topic',
        'channel.description',
        'channel.public',
        '(select count(*) from post_like where "postId" = post.id) AS "post_likesCount"',
        '(select count(*) from post_comment where "postId" = post.id) AS "post_commentsCount"',
        'COALESCE((select cast(id as boolean) from post_like where post.id = "post_like"."postId" and "post_like"."userId" = :currentUserId limit 1), false) AS "post_liked"',
      ])
      .innerJoin('savedPost.post', 'post')
      .leftJoin('post.createdBy', 'createdBy')
      .leftJoin('post.tags', 'tags')
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
      .paginateRaw(query, {
        primaryAlias: 'savedPost',
        aliases: ['channel', 'zone', 'createdBy', 'tags'],
      });
  }
}

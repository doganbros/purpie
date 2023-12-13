import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostComment } from 'entities/PostComment.entity';
import { PostCommentLike } from 'entities/PostCommentLike.entity';
import { IsNull, Repository } from 'typeorm';
import { PaginationQuery, PaginationResponse } from 'types/PaginationQuery';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreatePostCommentLikeDto } from '../dto/create-post-comment-like.dto';
import { CreatePostCommentDto } from '../dto/create-post-comment.dto';
import { PostEvent } from '../listeners/post-events';
import { ListPostCommentDto } from '../dto/list-post-comment.dto';

@Injectable()
export class PostCommentService {
  constructor(
    @InjectRepository(PostComment)
    private postCommentRepository: Repository<PostComment>,
    @InjectRepository(PostCommentLike)
    private postCommentLikeRepository: Repository<PostCommentLike>,
    private eventEmitter: EventEmitter2,
  ) {}

  async createComment(
    userId: string,
    info: CreatePostCommentDto,
  ): Promise<PostComment> {
    const postComment = await this.postCommentRepository
      .create({
        comment: info.comment,
        userId,
        parentId: info.parentId || null,
        postId: info.postId,
      })
      .save();

    const mentions = info.comment
      .match(/@[a-z0-9_]{2,25}/g)
      ?.map((v) => v.slice(1));

    if (mentions?.length) {
      mentions.forEach((mentionUserName) => {
        this.eventEmitter.emit(PostEvent.postCommentMentionNotification, {
          postComment,
          mentionUserName,
        });
      });
    }

    if (info.parentId) {
      this.eventEmitter.emit(PostEvent.postCommentReplyNotification, {
        postComment,
        parentId: info.parentId,
      });
    } else {
      this.eventEmitter.emit(PostEvent.postCommentNotification, {
        postComment,
      });
    }

    return postComment;
  }

  async listComments(
    userId: string,
    postId: string,
    query: ListPostCommentDto,
    params: Record<string, any>,
  ): Promise<PaginationResponse<PostComment>> {
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
        'user.fullName',
        'user.userName',
        'user.email',
        'user.displayPhoto',
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
          parentId: params.parentId,
        },
      )
      .orderBy(
        query.sortBy
          ? `"postComment_${query.sortBy}"`
          : '"postComment_createdOn"',
        query.sortOrder || 'DESC',
      )
      .paginate(query);
  }

  editComment(userId: string, commentId: string, comment: string) {
    return this.postCommentRepository.update(
      { userId, id: commentId },
      { comment, edited: true, updatedOn: new Date() },
    );
  }

  getCommentCount(postId: number, parentId?: number | null) {
    return this.postCommentRepository.count({
      where: {
        postId,
        parentId: parentId || IsNull(),
      },
    });
  }

  removeComment(userId: string, commentId: string) {
    return this.postCommentRepository.delete({ userId, id: commentId });
  }

  async createCommentLike(userId: string, info: CreatePostCommentLikeDto) {
    const postCommentLike = await this.postCommentLikeRepository
      .create({
        userId,
        postId: info.postId,
        commentId: info.postCommentId,
      })
      .save();

    this.eventEmitter.emit(PostEvent.postCommentLikeNotification, {
      postCommentLike,
    });

    return postCommentLike;
  }

  getCommentLikes(postId: string, commentId: string, query: PaginationQuery) {
    return this.postCommentLikeRepository
      .createQueryBuilder('postCommentLike')
      .select([
        'postCommentLike.id',
        'postCommentLike.createdOn',
        'user.id',
        'user.fullName',
        'user.userName',
        'user.email',
      ])
      .innerJoin('postCommentLike.user', 'user')
      .where('postCommentLike.postId = :postId', { postId })
      .andWhere('postCommentLike.commentId = :commentId', { commentId })
      .paginate(query);
  }

  removeCommentLike(userId: string, commentId: string) {
    return this.postCommentLikeRepository.delete({ userId, commentId });
  }
}

import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { PostComment } from 'entities/PostComment.entity';
import { PostCommentLike } from 'entities/PostCommentLike.entity';
import { Notification, NotificationType } from 'entities/Notification.entity';
import { PostLike } from 'entities/PostLike.entity';
import { Post } from 'entities/Post.entity';
import { Repository } from 'typeorm';
import { PostEvent } from './post-events';

@Injectable()
export class PostListener {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private postRepository: Repository<Post>,
  ) {}

  getPost(postId: number) {
    return this.postRepository.findOne(postId);
  }


  getUnviewedNotification(
    post: Post,
    type: NotificationType,
    otherFields?: any,
  ) {
    return this.notificationRepository.findOne({
      where: {
        userId: post.createdById,
        type,
        postId: post.id,
        ...otherFields,
      },
    });
  }

  @OnEvent(PostEvent.postNotification)
  handlePostNotification(event: Record<string, any>) {
    //
    return event;
  }

  @OnEvent(PostEvent.postLikeNotification)
  async handlePostLikeNotification(event: {
    postLike: PostLike;
  }): Promise<unknown> {
    const { postLike } = event;

    const post = await this.getPost(postLike.postId);

    if (!post) return;

    if (post.createdById === postLike.userId) return;

    const currentNotification = await this.getUnviewedNotification(
      post,
      'post_like',
    );

    if (!currentNotification || currentNotification.viewedOn) {
      await this.notificationRepository
        .create({
          userId: post.createdById,
          type: 'post_like',
          postId: postLike.postId,
          createdById: postLike.userId,
        })
        .save();

      return;
    }

    currentNotification.counter++;
    await currentNotification.save();
  }

  @OnEvent(PostEvent.postCommentNotification)
  async handlePostCommentNotification(event: { postComment: PostComment }) {
    const { postComment } = event;

    const post = await this.getPost(postComment.postId);

    if (!post) return;

    if (post.createdById === postComment.userId) return;

    const currentNotification = await this.getUnviewedNotification(
      post,
      'post_comment',
      { postCommentId: postComment.id },
    );

    if (!currentNotification || currentNotification.viewedOn) {
      await this.notificationRepository
        .create({
          userId: post.createdById,
          type: 'post_comment',
          postId: postComment.postId,
          createdById: postComment.userId,
          postCommentId: postComment.id,
        })
        .save();

      return;
    }

    currentNotification.counter++;
    await currentNotification.save();
  }

  @OnEvent(PostEvent.postCommentLikeNotification)
  async handlePostCommentLikeNotification(event: {
    postCommentLike: PostCommentLike;
  }) {
    const { postCommentLike } = event;

    const post = await this.getPost(postCommentLike.postId);

    if (!post) return;

    if (post.createdById === postCommentLike.userId) return;

    const currentNotification = await this.getUnviewedNotification(
      post,
      'post_comment_like',
      { postCommentId: postCommentLike.id },
    );

    if (!currentNotification || currentNotification.viewedOn) {
      await this.notificationRepository
        .create({
          userId: post.createdById,
          type: 'post_comment_like',
          postId: postCommentLike.postId,
          postCommentId: postCommentLike.commentId,
          createdById: postCommentLike.userId,
        })
        .save();

      return;
    }

    currentNotification.counter++;
    await currentNotification.save();
  }

  @OnEvent(PostEvent.postCommentReplyNotification)
  handlePostCommentReplyNotification(event: Record<string, any>) {
    //
    return event;
  }
}

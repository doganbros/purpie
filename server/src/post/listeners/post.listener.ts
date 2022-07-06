import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { PostComment } from 'entities/PostComment.entity';
import { PostCommentLike } from 'entities/PostCommentLike.entity';
import { User } from 'entities/User.entity';
import { Notification, NotificationType } from 'entities/Notification.entity';
import { PostLike } from 'entities/PostLike.entity';
import { Post } from 'entities/Post.entity';
import { Repository } from 'typeorm';
import { PostEvent } from './post-events';
import { PostService } from '../services/post.service';

@Injectable()
export class PostListener {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(PostComment)
    private postCommentRepository: Repository<PostComment>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private postService: PostService,
  ) {}

  getPost(postId: number) {
    return this.postRepository.findOne(postId);
  }

  getUnviewedNotification(
    param: { userId: number; postId: number },
    type: NotificationType,
    otherFields?: any,
  ) {
    return this.notificationRepository.findOne({
      where: {
        userId: param.userId,
        type,
        postId: param.postId,
        ...otherFields,
      },
      relations: ['postLike', 'postComment', 'postCommentLike'],
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

    if (!postLike.positive) return;

    const post = await this.getPost(postLike.postId);

    if (!post) return;

    if (post.createdById === postLike.userId) return;

    const currentNotification = await this.getUnviewedNotification(
      { userId: post.createdById, postId: post.id },
      'post_like',
    );

    if (!currentNotification || currentNotification.viewedOn) {
      await this.notificationRepository
        .create({
          userId: post.createdById,
          type: 'post_like',
          postId: postLike.postId,
          createdById: postLike.userId,
          postLikeId: postLike.id,
        })
        .save();
    }
  }

  @OnEvent(PostEvent.postCommentNotification)
  async handlePostCommentNotification(event: { postComment: PostComment }) {
    const { postComment } = event;

    const post = await this.getPost(postComment.postId);

    if (!post) return;

    if (post.createdById === postComment.userId) return;

    const currentNotification = await this.getUnviewedNotification(
      { userId: post.createdById, postId: post.id },
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
    }
  }

  @OnEvent(PostEvent.postCommentLikeNotification)
  async handlePostCommentLikeNotification(event: {
    postCommentLike: PostCommentLike;
  }) {
    const { postCommentLike } = event;

    const postComment = await this.postCommentRepository.findOne({
      where: { id: postCommentLike.commentId },
    });

    if (!postComment) return;

    if (postComment.userId === postCommentLike.userId) return;

    const currentNotification = await this.getUnviewedNotification(
      { userId: postComment.userId, postId: postCommentLike.postId },
      'post_comment_like',
      { postCommentId: postComment.id },
    );

    if (!currentNotification || currentNotification.viewedOn) {
      await this.notificationRepository
        .create({
          userId: postComment.userId,
          type: 'post_comment_like',
          postId: postCommentLike.postId,
          postCommentId: postCommentLike.commentId,
          postCommentLikeId: postCommentLike.id,
          createdById: postCommentLike.userId,
        })
        .save();
    }
  }

  @OnEvent(PostEvent.postCommentReplyNotification)
  async handlePostCommentReplyNotification(event: Record<string, any>) {
    //
    const { postComment, parentId } = event;

    const parentComment = await this.postCommentRepository
      .createQueryBuilder('postComment')
      .where('id = :id', { id: parentId })
      .getOne();

    if (!parentComment) return;

    if (parentComment.userId === postComment.userId) return;

    const currentNotification = await this.getUnviewedNotification(
      { userId: parentComment.userId, postId: parentComment.postId },
      'post_comment_reply',
      { postCommentId: parentId },
    );

    if (!currentNotification || currentNotification.viewedOn) {
      await this.notificationRepository
        .create({
          userId: parentComment.userId,
          type: 'post_comment_reply',
          postId: parentComment.postId,
          createdById: postComment.userId,
          postCommentId: parentId,
        })
        .save();
    }
  }

  @OnEvent(PostEvent.postCommentMentionNotification)
  async handlePostCommentMentionNotification(event: Record<string, any>) {
    const { postComment, mentionUserName } = event;

    const user = await this.userRepository.findOne({
      where: { userName: mentionUserName },
    });

    if (!user) return;

    const userId = user.id;

    const post = await this.postService.getOnePost(
      userId,
      postComment.postId,
      false,
    );

    if (!post) return;

    if (postComment.createdById === userId) return;

    await this.notificationRepository
      .create({
        userId,
        type: 'post_comment_mention',
        postId: postComment.postId,
        createdById: postComment.userId,
        postCommentId: postComment.id,
      })
      .save();
  }
}

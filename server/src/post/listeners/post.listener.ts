import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'entities/Notification.entity';
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

  @OnEvent(PostEvent.postNotification)
  handlePostNotification(event: Record<string, any>) {
    //
    return event;
  }

  @OnEvent(PostEvent.postLikeNotification)
  async handlePostLikeNotification(event: { postLike: PostLike }) {
    const { postLike } = event;

    const post = await this.getPost(postLike.postId);

    if (!post) return;

    if (post.createdById === postLike.userId) return;

    const currentNotification = await this.notificationRepository.findOne({
      where: {
        userId: post.createdById,
        type: 'post_like',
        postId: postLike.postId,
      },
    });

    if (!currentNotification) {
      //   await this;
    }
  }

  @OnEvent(PostEvent.postCommentNotification)
  handlePostCommentNotification(event: Record<string, any>) {
    //
    return event;
  }

  @OnEvent(PostEvent.postCommentLikeNotification)
  handlePostCommentLikeNotification(event: Record<string, any>) {
    //
    return event;
  }

  @OnEvent(PostEvent.postCommentReplyNotification)
  handlePostCommentReplyNotification(event: Record<string, any>) {
    //
    return event;
  }
}

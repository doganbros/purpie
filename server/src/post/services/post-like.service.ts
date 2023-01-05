import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostLike } from 'entities/PostLike.entity';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreatePostLikeDto } from '../dto/create-post-like.dto';
import { PostLikeQuery } from '../dto/post-like.query';
import { PostEvent } from '../listeners/post-events';

@Injectable()
export class PostLikeService {
  constructor(
    @InjectRepository(PostLike)
    private postLikeRepository: Repository<PostLike>,
    private eventEmitter: EventEmitter2,
  ) {}

  async createPostLike(userId: string, info: CreatePostLikeDto) {
    const positive = info.type !== 'dislike';
    const postLike = await this.postLikeRepository
      .create({
        userId,
        positive,
        postId: info.postId,
      })
      .save();

    this.eventEmitter.emit(PostEvent.postLikeNotification, { postLike });

    return postLike;
  }

  getPostLikes(postId: string, query: PostLikeQuery) {
    const baseQuery = this.postLikeRepository
      .createQueryBuilder('postLike')
      .select([
        'postLike.id',
        'postLike.createdOn',
        'postLike.positive',
        'user.id',
        'user.fullName',
        'user.userName',
        'user.email',
      ])
      .innerJoin('postLike.user', 'user')
      .where('postLike.postId = :postId', { postId });

    baseQuery.andWhere('postLike.positive = :positive', {
      postive: query.type !== 'dislikes',
    });

    return baseQuery.paginate(query);
  }

  getPostLikeCount(postId: string) {
    return this.postLikeRepository.count({ where: { postId } });
  }

  removePostLike(userId: string, postId: string) {
    return this.postLikeRepository.delete({ userId, postId });
  }
}

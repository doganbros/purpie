import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from 'entities/Contact.entity';
import { PostLike } from 'entities/PostLike.entity';
import { SavedPost } from 'entities/SavedPost.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { Brackets, Repository } from 'typeorm';
import { PaginationQuery, PaginationResponse } from 'types/PaginationQuery';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { CreateSavedPostDto } from '../dto/create-saved-post.dto';

@Injectable()
export class PostSavedService {
  constructor(
    @InjectRepository(SavedPost)
    private savedPostRepository: Repository<SavedPost>,
  ) {}

  createSavedPost(
    userId: number,
    info: CreateSavedPostDto,
  ): Promise<SavedPost> {
    return this.savedPostRepository
      .create({
        userId,
        postId: info.postId,
      })
      .save();
  }

  listSavedPost(
    userId: number,
    query: PaginationQuery,
  ): Promise<PaginationResponse<SavedPost>> {
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
        'post.allowReaction',
        'post.allowComment',
        'post.videoName',
        'post.channelId',
        'post.liveStream',
        'post.streaming',
        'post.record',
        'postReaction.dislikesCount',
        'postReaction.likesCount',
        'postReaction.commentsCount',
        'postReaction.viewsCount',
        'postReaction.liveStreamViewersCount',
        'createdBy.id',
        'createdBy.email',
        'createdBy.fullName',
      ])
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
        'contact.userId = post.createdById AND contact.contactUserId = :userId',
        { userId },
      )
      .where('savedPost.userId = :userId', { userId })
      .andWhere(
        new Brackets((qb) => {
          qb.where('post.public = true').orWhere(
            'post.public = false and post."createdById" = :userId',
          );
        }),
      )
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

  removeSavedPost(userId: number, postId: number): Promise<DeleteResult> {
    return this.savedPostRepository.delete({ userId, postId });
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'entities/Post.entity';
import { PostComment } from 'entities/PostComment.entity';
import { PostLike } from 'entities/PostLike.entity';
import { SavedPost } from 'entities/SavedPost.entity';
import { User } from 'entities/User.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Post, PostLike, PostComment, SavedPost]),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
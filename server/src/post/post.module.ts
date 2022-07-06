import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'entities/Notification.entity';
import { Post } from 'entities/Post.entity';
import { PostComment } from 'entities/PostComment.entity';
import { PostCommentLike } from 'entities/PostCommentLike.entity';
import { PostLike } from 'entities/PostLike.entity';
import { PostVideo } from 'entities/PostVideo.entity';
import { PostView } from 'entities/PostView.entity';
import { SavedPost } from 'entities/SavedPost.entity';
import { User } from 'entities/User.entity';
import { PostController } from './controllers/post.controller';
import { PostListener } from './listeners/post.listener';
import { PostService } from './services/post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Post,
      PostView,
      PostLike,
      PostComment,
      PostCommentLike,
      SavedPost,
      PostVideo,
      Notification,
    ]),
  ],
  controllers: [PostController],
  providers: [PostService, PostListener],
  exports: [PostService],
})
export class PostModule {}

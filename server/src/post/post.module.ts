import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'entities/Notification.entity';
import { Post } from 'entities/Post.entity';
import { PostComment } from 'entities/PostComment.entity';
import { PostCommentLike } from 'entities/PostCommentLike.entity';
import { PostLike } from 'entities/PostLike.entity';
import { PostVideo } from 'entities/PostVideo.entity';
import { PostView } from 'entities/PostView.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { FeaturedPost } from 'entities/FeaturedPost.entity';
import { User } from 'entities/User.entity';
import { PostController } from './controllers/post.controller';
import { PostListener } from './listeners/post.listener';
import { PostService } from './services/post.service';
import { PostFolder } from '../../entities/PostFolder.entity';
import { PostFolderItem } from '../../entities/PostFolderItem.entity';
import { FolderService } from './services/folder.service';
import { PostCommentService } from './services/post-comment.service';
import { PostCommentController } from './controllers/post-comment.controller';
import { PostLikeService } from './services/post-like.service';
import { PostFolderController } from './controllers/post-folder.controller';
import { PostLikeController } from './controllers/post-like.controller';
import { UserLogModule } from '../log/user-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Post,
      FeaturedPost,
      PostView,
      PostLike,
      PostComment,
      UserChannel,
      PostCommentLike,
      PostVideo,
      Notification,
      PostFolder,
      PostFolderItem,
    ]),
    UserLogModule,
  ],
  controllers: [
    PostController,
    PostCommentController,
    PostFolderController,
    PostLikeController,
  ],
  providers: [
    PostService,
    PostListener,
    FolderService,
    PostCommentService,
    PostLikeService,
  ],
  exports: [PostService, FolderService],
})
export class PostModule {}

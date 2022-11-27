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
import { SavedPost } from 'entities/SavedPost.entity';
import { User } from 'entities/User.entity';
import { PostController } from './controllers/post.controller';
import { PostListener } from './listeners/post.listener';
import { PostService } from './services/post.service';
import { PostFolder } from '../../entities/PostFolder.entity';
import { PostFolderItem } from '../../entities/PostFolderItem.entity';
import { FolderService } from './services/folder.service';

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
      SavedPost,
      PostVideo,
      Notification,
      PostFolder,
      PostFolderItem,
    ]),
  ],
  controllers: [PostController],
  providers: [PostService, PostListener, FolderService],
  exports: [PostService],
})
export class PostModule {}

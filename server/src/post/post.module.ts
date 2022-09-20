import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'entities/Notification.entity';
import { Post } from 'entities/Post.entity';
import { PostComment } from 'entities/PostComment.entity';
import { PostCommentLike } from 'entities/PostCommentLike.entity';
import { PostLike } from 'entities/PostLike.entity';
import { PostVideo } from 'entities/PostVideo.entity';
import { PlaylistItem } from 'entities/PlaylistItem.entity';
import { PostView } from 'entities/PostView.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { FeaturedPost } from 'entities/FeaturedPost.entity';
import { Playlist } from 'entities/Playlist.entity';
import { SavedPost } from 'entities/SavedPost.entity';
import { User } from 'entities/User.entity';
import { PostController } from './controllers/post.controller';
import { PostListener } from './listeners/post.listener';
import { PostService } from './services/post.service';
import { PlaylistService } from './services/playlist.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Post,
      FeaturedPost,
      Playlist,
      PlaylistItem,
      PostView,
      PostLike,
      PostComment,
      UserChannel,
      PostCommentLike,
      SavedPost,
      PostVideo,
      Notification,
    ]),
  ],
  controllers: [PostController],
  providers: [PostService, PostListener, PlaylistService],
  exports: [PostService],
})
export class PostModule {}

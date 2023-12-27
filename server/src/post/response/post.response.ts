import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from 'aws-sdk/clients/budgets';
import { BasePostFeedList } from './post-list-feed.response';

export class PostCommentResponse {
  @ApiProperty()
  id: number;

  @ApiPropertyOptional()
  parentId: number;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  postId: string;

  @ApiProperty()
  comment: string;

  @ApiPropertyOptional()
  replyCount: number;

  @ApiPropertyOptional()
  likesCount: number;

  @ApiPropertyOptional()
  liked: boolean;

  @ApiProperty()
  publishedInLiveStream: boolean;

  @ApiProperty()
  createdOn: Date;

  @ApiPropertyOptional()
  updatedOn: Date;
}

export class PostCommentListResponse {
  @ApiProperty({ isArray: true })
  data: PostCommentResponse;

  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  skip: number;
}

class PostLikeList {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user: User;

  @ApiProperty()
  createdOn: Date;

  @ApiProperty()
  updatedOn: Date;
}

export class PostLikeListResponse {
  @ApiProperty({ isArray: true })
  data: PostLikeList;

  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  skip: number;
}

export class PostFolderResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdOn: Date;

  @ApiPropertyOptional()
  updatedOn: Date;

  @ApiProperty()
  postId: string;

  @ApiProperty()
  folderId: string;

  @ApiProperty()
  post: BasePostFeedList;
}

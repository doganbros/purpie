import { ApiProperty } from '@nestjs/swagger';
import { User } from 'aws-sdk/clients/budgets';

class PostCommentList {
  @ApiProperty()
  id: number;

  @ApiProperty()
  comment: string;

  @ApiProperty()
  replyCount: number;

  @ApiProperty({ nullable: true })
  parentId: number;

  @ApiProperty()
  createdOn: Date;

  @ApiProperty()
  updatedOn: Date;

  @ApiProperty()
  edited: boolean;

  @ApiProperty()
  user: User;

  @ApiProperty()
  publishedInLiveStream: boolean;
}

export class PostCommentListResponse {
  @ApiProperty({ isArray: true })
  data: PostCommentList;

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

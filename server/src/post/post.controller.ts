import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { s3, s3HeadObject } from 'config/s3-storage';
import { errorResponseDoc } from 'helpers/error-response-doc';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserTokenPayload } from 'src/auth/interfaces/user.interface';
import { ValidationBadRequest } from 'src/utils/decorators/validation-bad-request.decorator';
import { PaginationQuery } from 'types/PaginationQuery';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { CreatePostLikeDto } from './dto/create-post-like.dto';
import { CreateSavedPostDto } from './dto/create-saved-post.dto';
import { UpdatePostCommentDto } from './dto/update-comment.dto';
import { PostService } from './post.service';
import {
  PostCommentListResponse,
  PostLikeListResponse,
} from './response/post.response';
import {
  MixedPostFeedDetail,
  MixedPostFeedListResponse,
  PublicPostFeedListResponse,
} from './response/post-list-feed.response';
import { ListPostFeedQuery } from './dto/list-post-feed.query';
import { EditPostDto } from './dto/edit-post.dto';

const {
  S3_VIDEO_POST_DIR = '',
  S3_VIDEO_BUCKET_NAME = '',
  S3_VIDEO_MEETING_RECORDING_DIR = '',
} = process.env;

@Controller({ version: '1', path: 'post' })
@ApiTags('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  async validatePost(userId: number, postId: number) {
    const post = await this.postService.getOnePost(userId, postId, true);

    if (!post)
      throw new NotFoundException(
        'Post not found or unauthorized',
        'POST_NOT_FOUND',
      );
  }

  @Post('comment/create')
  @ValidationBadRequest()
  @ApiCreatedResponse({
    description: 'User creates a new comment. Returns the comment id',
    schema: { type: 'int', example: 1 },
  })
  @ApiNotFoundResponse({
    description:
      'Error thrown when the post is not found or user does not have the right to access',
    schema: errorResponseDoc(
      404,
      'Post not found or unauthorized',
      'POST_NOT_FOUND',
    ),
  })
  @IsAuthenticated()
  async createPostComment(
    @Body() info: CreatePostCommentDto,
    @CurrentUser() user: UserTokenPayload,
  ) {
    await this.validatePost(user.id, info.postId);

    const comment = await this.postService.createPostComment(user.id, info);

    return comment.id;
  }

  @Get('comment/list/:postId/:parentId?')
  @ApiParam({
    type: Number,
    name: 'parentId',
    required: false,
    allowEmptyValue: true,
  })
  @ApiOkResponse({
    type: PostCommentListResponse,
    description:
      'User gets the comments belonging to the postId. If parentId param is specificied, retrieves the replies for that comment',
  })
  @ApiNotFoundResponse({
    description:
      'Error thrown when the post is not found or user does not have the right to access',
    schema: errorResponseDoc(
      404,
      'Post not found or unauthorized',
      'POST_NOT_FOUND',
    ),
  })
  @IsAuthenticated()
  async getPostComments(
    @Query() query: PaginationQuery,
    @Param('postId', ParseIntPipe) postId: number,
    @Param() params: Record<string, any>,
    @CurrentUser() user: UserTokenPayload,
  ) {
    await this.validatePost(user.id, Number(postId));

    return this.postService.getPostComments(postId, query, params);
  }

  @Put('comment/update')
  @ValidationBadRequest()
  @ApiCreatedResponse({
    description: 'User updates a comment',
    schema: { type: 'string', example: 'OK' },
  })
  @IsAuthenticated()
  async updatePostComment(
    @Body() info: UpdatePostCommentDto,
    @CurrentUser() user: UserTokenPayload,
  ) {
    await this.postService.editPostComment(
      user.id,
      info.commentId,
      info.comment,
    );

    return 'OK';
  }

  @Get('comment/count/:postId/:parentId?')
  @ApiOkResponse({
    description:
      'Get the number of comments belonging to the postId. If parentId is specified, it returns the number of replies for that comment',
    schema: { type: 'int', example: 15 },
  })
  @IsAuthenticated()
  @ApiParam({
    type: Number,
    name: 'postId',
  })
  @ApiParam({
    type: Number,
    name: 'parentId',
    required: false,
    allowEmptyValue: true,
  })
  @ApiNotFoundResponse({
    description:
      'Error thrown when the post is not found or user does not have the right to access',
    schema: errorResponseDoc(
      404,
      'Post not found or unauthorized',
      'POST_NOT_FOUND',
    ),
  })
  async getPostCommentCount(
    @Param('postId') postId: string,
    @Param('parentId') parentId: string,
    @CurrentUser() user: UserTokenPayload,
  ) {
    await this.validatePost(user.id, Number(postId));

    return this.postService.getPostCommentCount(
      Number(postId),
      Number(parentId),
    );
  }

  @Delete('comment/remove/:commentId')
  @ApiCreatedResponse({
    description:
      'User deletes a comment. Returns Created when some rows are affected and OK otherwise',
    schema: { type: 'string', example: 'OK' },
  })
  @IsAuthenticated()
  @ApiParam({
    type: Number,
    name: 'commentId',
  })
  async removePostComment(
    @CurrentUser() user: UserTokenPayload,
    @Param('commentId') commentId: string,
  ) {
    const result = await this.postService.removePostComment(
      user.id,
      Number(commentId),
    );

    return result.affected === 0 ? 'OK' : 'Created';
  }

  @Post('like/create')
  @ValidationBadRequest()
  @ApiCreatedResponse({
    description: 'User likes a post. Returns the like id',
    schema: { type: 'int', example: 1 },
  })
  @IsAuthenticated()
  @ApiNotFoundResponse({
    description:
      'Error thrown when the post is not found or user does not have the right to access',
    schema: errorResponseDoc(
      404,
      'Post not found or unauthorized',
      'POST_NOT_FOUND',
    ),
  })
  async createPostLike(
    @Body() info: CreatePostLikeDto,
    @CurrentUser() user: UserTokenPayload,
  ) {
    await this.validatePost(user.id, info.postId);

    const like = await this.postService.createPostLike(user.id, info);

    return like.id;
  }

  @Get('like/list/:postId')
  @ApiOkResponse({
    type: PostLikeListResponse,
    description: 'User gets the likes belonging to the postId',
  })
  @ApiNotFoundResponse({
    description:
      'Error thrown when the post is not found or user does not have the right to access',
    schema: errorResponseDoc(
      404,
      'Post not found or unauthorized',
      'POST_NOT_FOUND',
    ),
  })
  @IsAuthenticated()
  async getPostLikes(
    @Query() query: PaginationQuery,
    @Param('postId') postId: string,
    @CurrentUser() user: UserTokenPayload,
  ) {
    await this.validatePost(user.id, Number(postId));

    return this.postService.getPostLikes(Number(postId), query);
  }

  @Get('like/count/:postId')
  @ApiNotFoundResponse({
    description:
      'Error thrown when the post is not found or user does not have the right to access',
    schema: errorResponseDoc(
      404,
      'Post not found or unauthorized',
      'POST_NOT_FOUND',
    ),
  })
  @ApiOkResponse({
    description: 'Get the number of likes belonging to the postId.',
    schema: { type: 'int', example: 15 },
  })
  @IsAuthenticated()
  @ApiParam({
    type: Number,
    name: 'postId',
  })
  async getPostLikeCount(
    @Param('postId') postId: string,
    @CurrentUser() user: UserTokenPayload,
  ) {
    await this.validatePost(user.id, Number(postId));

    return this.postService.getPostLikeCount(Number(postId));
  }

  @Delete('like/remove/:postId')
  @ApiCreatedResponse({
    description:
      'User unlikes a post. Returns Created when some rows are affected and OK otherwise',
    schema: { type: 'string', example: 'OK' },
  })
  @IsAuthenticated()
  @ApiParam({
    type: Number,
    description: 'The post id to unlike',
    name: 'postId',
  })
  async removePostLike(
    @CurrentUser() user: UserTokenPayload,
    @Param('postId') postId: string,
  ) {
    const result = await this.postService.removePostLike(
      user.id,
      Number(postId),
    );

    return result.affected === 0 ? 'OK' : 'Created';
  }

  @Get('saved/list')
  @IsAuthenticated()
  @ApiOkResponse({
    description: 'User gets posts saved',
    type: MixedPostFeedListResponse,
  })
  async getSavedPostList(
    @CurrentUser() user: UserTokenPayload,
    @Query() query: PaginationQuery,
  ) {
    return this.postService.getSavedPosts(user.id, query);
  }

  @Delete('saved/remove/:postId')
  @ApiCreatedResponse({
    description:
      'User unlikes a post. Returns Created when some rows are affected and OK otherwise',
    schema: { type: 'string', example: 'OK' },
  })
  @IsAuthenticated()
  @ApiParam({
    type: Number,
    name: 'postId',
  })
  async removeSavedPost(
    @CurrentUser() user: UserTokenPayload,
    @Param('postId') postId: string,
  ) {
    const result = await this.postService.removeSavedPost(
      user.id,
      Number(postId),
    );
    return result.affected === 0 ? 'OK' : 'Created';
  }

  @Post('saved/create')
  @ValidationBadRequest()
  @ApiNotFoundResponse({
    description:
      'Error thrown when the post is not found or user does not have the right to access',
    schema: errorResponseDoc(
      404,
      'Post not found or unauthorized',
      'POST_NOT_FOUND',
    ),
  })
  @IsAuthenticated()
  @ApiCreatedResponse({
    description: 'User saves a post. Returns the saved post id',
    schema: { type: 'int', example: 1 },
  })
  async createSavedPost(
    @Body() info: CreateSavedPostDto,
    @CurrentUser() user: UserTokenPayload,
  ) {
    await this.validatePost(user.id, info.postId);

    const savedPost = await this.postService.createSavedPost(user.id, info);

    return savedPost.id;
  }

  @Get('video/view/:slug/:fileName')
  @IsAuthenticated()
  async viewVideoPost(
    @CurrentUser() user: UserTokenPayload,
    @Param('slug') slug: string,
    @Param('fileName') fileName: string,
    @Res() res: Response,
  ) {
    try {
      const postVideo = await this.postService.getPostVideoForUserBySlugAndFileName(
        user.id,
        slug,
        fileName,
      );

      if (!postVideo)
        throw new NotFoundException('Video not found', 'VIDEO_NOT_FOUND');

      const creds = {
        Bucket: S3_VIDEO_BUCKET_NAME,
        Key:
          postVideo.post.type === 'meeting'
            ? `${S3_VIDEO_MEETING_RECORDING_DIR}${slug}/${postVideo.fileName}`
            : `${S3_VIDEO_POST_DIR}${postVideo.fileName}`,
      };
      const head = await s3HeadObject(creds);
      const objectStream = s3.getObject(creds).createReadStream();

      res.setHeader('Content-Disposition', `filename=${postVideo.fileName}`);
      if (head.ContentType) res.setHeader('Content-Type', head.ContentType);

      return objectStream.pipe(res);
    } catch (err: any) {
      return res.status(err.statusCode || 500).json(err);
    }
  }

  @Get('/list/feed/public')
  @ApiOkResponse({
    description: 'User gets public feed',
    type: PublicPostFeedListResponse,
  })
  @IsAuthenticated()
  getPublicFeed(
    @Query() query: ListPostFeedQuery,
    @CurrentUser() user: UserTokenPayload,
  ) {
    return this.postService.getPublicFeed(query, user.id);
  }

  @Get('/list/feed/user')
  @ApiOkResponse({
    description: 'User gets main feed from channels and from contacts',
    type: MixedPostFeedListResponse,
  })
  @IsAuthenticated()
  getUserFeed(
    @Query() query: ListPostFeedQuery,
    @CurrentUser() user: UserTokenPayload,
  ) {
    return this.postService.getUserFeed(user.id, query);
  }

  @Get('/list/feed/zone/:zoneId')
  @ApiOkResponse({
    description: 'User gets feed for a zone from channels of this zone',
    type: MixedPostFeedListResponse,
  })
  @IsAuthenticated()
  getZoneFeed(
    @Query() query: ListPostFeedQuery,
    @CurrentUser() user: UserTokenPayload,
    @Param('zoneId', ParseIntPipe) zoneId: number,
  ) {
    return this.postService.getZoneFeed(zoneId, user.id, query);
  }

  @Get('/list/feed/channel/:channelId')
  @ApiOkResponse({
    description: 'User gets feed for this channel',
    type: MixedPostFeedListResponse,
  })
  @IsAuthenticated()
  getChannelFeed(
    @Query() query: ListPostFeedQuery,
    @CurrentUser() user: UserTokenPayload,
    @Param('channelId', ParseIntPipe) channelId: number,
  ) {
    return this.postService.getChannelFeed(channelId, user.id, query);
  }

  @Get('/detail/feed/:postId')
  @ApiOkResponse({
    description: 'User gets post by id',
    type: MixedPostFeedDetail,
  })
  @IsAuthenticated()
  async getFeedById(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser() user: UserTokenPayload,
  ) {
    const result = await this.postService.getPostById(user.id, postId);

    if (!result)
      throw new NotFoundException(
        'Post not found or unauthorized',
        'POST_NOT_FOUND',
      );

    return result;
  }

  @Put('update/:postId')
  @IsAuthenticated()
  async editPostById(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser() user: UserTokenPayload,
    @Body() editPostPayload: EditPostDto,
  ) {
    await this.postService.editPost(postId, user.id, editPostPayload);

    return 'OK';
  }
}

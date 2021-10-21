import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { errorResponseDoc } from 'helpers/error-response-doc';
import { MixedActivityFeedListResponse } from 'src/activity/activity.response';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserPayload } from 'src/auth/interfaces/user.interface';
import { PaginationQueryParams } from 'src/utils/decorators/pagination-query-params.decorator';
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

@Controller({ version: '1', path: 'post' })
@ApiTags('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  async validatePost(userId: number, postId: number) {
    const post = await this.postService.getPostById(userId, postId);

    if (!post) throw new NotFoundException('Post not found', 'POST_NOT_FOUND');
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
    schema: errorResponseDoc(404, 'Post not found', 'POST_NOT_FOUND'),
  })
  @IsAuthenticated()
  async createPostComment(
    @Body() info: CreatePostCommentDto,
    @CurrentUser() user: UserPayload,
  ) {
    await this.validatePost(user.id, info.postId);

    const comment = await this.postService.createPostComment(user.id, info);

    return comment.id;
  }

  @Get('comment/list/:postId/:parentId?')
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
  @ApiOkResponse({
    type: PostCommentListResponse,
    description:
      'User gets the comments belonging to the postId. If parentId param is specificied, retrieves the replies for that comment',
  })
  @ApiNotFoundResponse({
    description:
      'Error thrown when the post is not found or user does not have the right to access',
    schema: errorResponseDoc(404, 'Post not found', 'POST_NOT_FOUND'),
  })
  @PaginationQueryParams()
  @IsAuthenticated()
  async getPostComments(
    @Query() query: PaginationQuery,
    @Param('postId') postId: string,
    @Param() params: Record<string, any>,
    @CurrentUser() user: UserPayload,
  ) {
    await this.validatePost(user.id, Number(postId));

    return this.postService.getPostComments(Number(postId), query, params);
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
    @CurrentUser() user: UserPayload,
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
    schema: errorResponseDoc(404, 'Post not found', 'POST_NOT_FOUND'),
  })
  async getPostCommentCount(
    @Param('postId') postId: string,
    @Param('parentId') parentId: string,
    @CurrentUser() user: UserPayload,
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
    @CurrentUser() user: UserPayload,
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
    schema: errorResponseDoc(404, 'Post not found', 'POST_NOT_FOUND'),
  })
  async createPostLike(
    @Body() info: CreatePostLikeDto,
    @CurrentUser() user: UserPayload,
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
  @PaginationQueryParams()
  @ApiNotFoundResponse({
    description:
      'Error thrown when the post is not found or user does not have the right to access',
    schema: errorResponseDoc(404, 'Post not found', 'POST_NOT_FOUND'),
  })
  @IsAuthenticated()
  async getPostLikes(
    @Query() query: PaginationQuery,
    @Param('postId') postId: string,
    @CurrentUser() user: UserPayload,
  ) {
    await this.validatePost(user.id, Number(postId));

    return this.postService.getPostLikes(Number(postId), query);
  }

  @Get('like/count/:postId')
  @ApiNotFoundResponse({
    description:
      'Error thrown when the post is not found or user does not have the right to access',
    schema: errorResponseDoc(404, 'Post not found', 'POST_NOT_FOUND'),
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
    @CurrentUser() user: UserPayload,
  ) {
    await this.validatePost(user.id, Number(postId));

    return this.postService.getPostLikeCount(Number(postId));
  }

  @Delete('like/remove/:likeId')
  @ApiCreatedResponse({
    description:
      'User unlikes a post. Returns Created when some rows are affected and OK otherwise',
    schema: { type: 'string', example: 'OK' },
  })
  @IsAuthenticated()
  @ApiParam({
    type: Number,
    name: 'likeId',
  })
  async removePostLike(
    @CurrentUser() user: UserPayload,
    @Param('likeId') likeId: string,
  ) {
    const result = await this.postService.removePostLike(
      user.id,
      Number(likeId),
    );

    return result.affected === 0 ? 'OK' : 'Created';
  }

  @Get('saved/list')
  @IsAuthenticated()
  @ApiOkResponse({
    description: 'User gets posts saved',
    type: MixedActivityFeedListResponse,
  })
  @PaginationQueryParams()
  async getSavedPostList(
    @CurrentUser() user: UserPayload,
    @Query() query: PaginationQuery,
  ) {
    return this.postService.getSavedPosts(user.id, query);
  }

  @Delete('saved/remove/:savedPostId')
  @ApiCreatedResponse({
    description:
      'User unlikes a post. Returns Created when some rows are affected and OK otherwise',
    schema: { type: 'string', example: 'OK' },
  })
  @IsAuthenticated()
  @ApiParam({
    type: Number,
    name: 'savedPostId',
  })
  async removeSavedPost(
    @CurrentUser() user: UserPayload,
    @Param('savedPostId') savedPostId: string,
  ) {
    const result = await this.postService.removeSavedPost(
      user.id,
      Number(savedPostId),
    );
    return result.affected === 0 ? 'OK' : 'Created';
  }

  @Post('saved/create')
  @ValidationBadRequest()
  @ApiNotFoundResponse({
    description:
      'Error thrown when the post is not found or user does not have the right to access',
    schema: errorResponseDoc(404, 'Post not found', 'POST_NOT_FOUND'),
  })
  @IsAuthenticated()
  @ApiCreatedResponse({
    description: 'User saves a post. Returns the saved post id',
    schema: { type: 'int', example: 1 },
  })
  async createSavedPost(
    @Body() info: CreateSavedPostDto,
    @CurrentUser() user: UserPayload,
  ) {
    await this.validatePost(user.id, info.postId);

    const savedPost = await this.postService.createSavedPost(user.id, info);

    return savedPost.id;
  }
}

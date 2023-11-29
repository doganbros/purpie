import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { errorResponseDoc } from 'helpers/error-response-doc';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserTokenPayload } from 'src/auth/interfaces/user.interface';
import { ValidationBadRequest } from 'src/utils/decorators/validation-bad-request.decorator';
import { PaginationQuery } from 'types/PaginationQuery';
import { CreatePostCommentDto } from '../dto/create-post-comment.dto';
import { UpdatePostCommentDto } from '../dto/update-comment.dto';
import {
  PostCommentListResponse,
  PostCommentResponse,
  PostLikeListResponse,
} from '../response/post.response';
import { ErrorTypes } from '../../../types/ErrorTypes';
import { PostCommentService } from '../services/post-comment.service';
import { PostService } from '../services/post.service';
import { CreatePostCommentLikeDto } from '../dto/create-post-comment-like.dto';
import { ListPostCommentDto } from '../dto/list-post-comment.dto';

@Controller({ version: '1', path: 'post/comment' })
@ApiTags('Post Comment')
export class PostCommentController {
  constructor(
    private readonly postService: PostService,
    private readonly postCommentService: PostCommentService,
  ) {}

  @Post('create')
  @ValidationBadRequest()
  @ApiCreatedResponse({
    description: 'Post comment created.',
    type: PostCommentResponse,
  })
  @ApiNotFoundResponse({
    description:
      'Error thrown when the post is not found or user does not have the right to access',
    schema: errorResponseDoc(
      404,
      'Post not found or unauthorized',
      ErrorTypes.POST_NOT_FOUND,
    ),
  })
  @ApiForbiddenResponse({
    description: 'Error thrown when the post is not allow to comment.',
    schema: errorResponseDoc(
      403,
      "This post doesn't allow comments",
      ErrorTypes.POST_COMMENTS_NOT_ALLOWED,
    ),
  })
  @IsAuthenticated()
  @ApiOperation({
    summary: 'Create Comment',
    description:
      'Create new post comment which consist of requested payload. Also, user can create parent-child relational comments.',
  })
  async createComment(
    @Body() info: CreatePostCommentDto,
    @CurrentUser() user: UserTokenPayload,
  ) {
    const post = await this.postService.validatePost(user.id, info.postId);

    if (!post.allowComment)
      throw new ForbiddenException(
        ErrorTypes.POST_COMMENTS_NOT_ALLOWED,
        `This post doesn't allow comments`,
      );

    return this.postCommentService.createComment(user.id, info);
  }

  @Get('list/:postId/:parentId?')
  @ApiParam({
    type: Number,
    name: 'parentId',
    required: false,
    allowEmptyValue: true,
  })
  @ApiOkResponse({
    type: PostCommentListResponse,
    description: 'List specific post comments',
  })
  @ApiOperation({
    summary: 'List Comments',
    description:
      'List comments belonging to the postId. If parentId param is specified, retrieves the replies for that comment.',
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
  async listComments(
    @Query() query: ListPostCommentDto,
    @Param('postId', ParseUUIDPipe) postId: string,
    @Param() params: Record<string, any>,
    @CurrentUser() user: UserTokenPayload,
  ) {
    await this.postService.validatePost(user.id, postId);

    return this.postCommentService.listComments(user.id, postId, query, params);
  }

  @Put('update')
  @ValidationBadRequest()
  @ApiCreatedResponse({
    description: 'Comment updated.',
  })
  @IsAuthenticated()
  @ApiOperation({
    summary: 'Update Comment',
    description: 'Update post comment with requested payload.',
  })
  async updateComment(
    @Body() info: UpdatePostCommentDto,
    @CurrentUser() user: UserTokenPayload,
  ) {
    await this.postCommentService.editComment(
      user.id,
      info.commentId,
      info.comment,
    );

    return 'OK';
  }

  @Delete('remove/:commentId')
  @ApiAcceptedResponse({
    description: 'Comment deleted',
  })
  @IsAuthenticated()
  @ApiParam({
    type: Number,
    name: 'commentId',
  })
  @ApiOperation({
    summary: 'Delete Comment',
    description: 'Delete post comment with requested commentId.',
  })
  async removeComment(
    @CurrentUser() user: UserTokenPayload,
    @Param('commentId') commentId: string,
  ) {
    await this.postCommentService.removeComment(user.id, commentId);
    return 'OK';
  }

  @Get('count/:postId/:parentId?')
  @ApiOkResponse({
    description: 'Get comment count',
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
  @ApiOperation({
    summary: 'Comment Count',
    description:
      'Get the number of comments belonging to the postId. If parentId is specified, it returns the number of replies for that comment.',
  })
  @ApiNotFoundResponse({
    description:
      'Error thrown when the post is not found or user does not have the right to access',
    schema: errorResponseDoc(
      404,
      'Post not found or unauthorized',
      ErrorTypes.POST_NOT_FOUND,
    ),
  })
  async getCommentCount(
    @Param('postId') postId: string,
    @Param('parentId') parentId: string,
    @CurrentUser() user: UserTokenPayload,
  ) {
    await this.postService.validatePost(user.id, postId);

    return this.postCommentService.getCommentCount(
      Number(postId),
      Number(parentId),
    );
  }

  @Post('like/create')
  @ValidationBadRequest()
  @ApiCreatedResponse({
    description: 'Liked a post comment.',
  })
  @IsAuthenticated()
  @ApiNotFoundResponse({
    description:
      'Error thrown when the post is not found or user does not have the right to access',
    schema: errorResponseDoc(
      404,
      'Post not found or unauthorized',
      ErrorTypes.POST_NOT_FOUND,
    ),
  })
  @ApiOperation({
    summary: 'Create Comment Like',
    description:
      'Create a like which related with post comment with requested payload.',
  })
  async createCommentLike(
    @Body() info: CreatePostCommentLikeDto,
    @CurrentUser() user: UserTokenPayload,
  ) {
    await this.postService.validatePost(user.id, info.postId);

    await this.postCommentService.createCommentLike(user.id, info);

    return 'Created';
  }

  @Get('like/list/:postId/:commentId')
  @ApiOkResponse({
    type: PostLikeListResponse,
    description: 'List post comment like',
  })
  @ApiOperation({
    summary: 'List Comment Like',
    description:
      'List post comment likes belonging to the postId and commentId.',
  })
  @ApiParam({
    type: Number,
    name: 'postId',
  })
  @ApiParam({
    type: Number,
    name: 'commentId',
  })
  @ApiNotFoundResponse({
    description:
      'Error thrown when the post is not found or user does not have the right to access',
    schema: errorResponseDoc(
      404,
      'Post not found or unauthorized',
      ErrorTypes.POST_NOT_FOUND,
    ),
  })
  @IsAuthenticated()
  async getCommentLikes(
    @Query() query: PaginationQuery,
    @Param('postId', ParseUUIDPipe) postId: string,
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @CurrentUser() user: UserTokenPayload,
  ) {
    await this.postService.validatePost(user.id, postId);

    return this.postCommentService.getCommentLikes(postId, commentId, query);
  }

  @Delete('like/remove/:commentId')
  @ApiAcceptedResponse({
    description: 'Unlike post comment',
  })
  @ApiOperation({
    summary: 'Delete Comment Like',
    description: 'Delete post comment like with requested commentId.',
  })
  @IsAuthenticated()
  async removeCommentLike(
    @CurrentUser() user: UserTokenPayload,
    @Param('commentId', ParseUUIDPipe) commentId: string,
  ) {
    await this.postCommentService.removeCommentLike(user.id, commentId);

    return 'OK';
  }
}

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
  Res,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { errorResponseDoc } from 'helpers/error-response-doc';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserTokenPayload } from 'src/auth/interfaces/user.interface';
import { ValidationBadRequest } from 'src/utils/decorators/validation-bad-request.decorator';
import { PaginationQuery } from 'types/PaginationQuery';
import { Response } from 'express';
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
    description: 'User creates a new comment for given postId. ',
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
    description:
      'User gets the comments belonging to the postId. If parentId param is specified, retrieves the replies for that comment',
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
    @Query() query: PaginationQuery,
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
    description: 'User updates a specific post comment',
  })
  @IsAuthenticated()
  async updateComment(
    @Body() info: UpdatePostCommentDto,
    @CurrentUser() user: UserTokenPayload,
    @Res() res: Response,
  ) {
    await this.postCommentService.editComment(
      user.id,
      info.commentId,
      info.comment,
    );

    return res.status(201);
  }

  @Delete('remove/:commentId')
  @ApiAcceptedResponse({
    description: 'User deletes a comment successfully.',
  })
  @IsAuthenticated()
  @ApiParam({
    type: Number,
    name: 'commentId',
  })
  async removeComment(
    @CurrentUser() user: UserTokenPayload,
    @Param('commentId') commentId: string,
    @Res() res: Response,
  ) {
    await this.postCommentService.removeComment(user.id, commentId);

    return res.status(202);
  }

  @Get('count/:postId/:parentId?')
  @ApiOkResponse({
    description:
      'Get the number of comments belonging to the postId. If parentId is specified, it returns the number of replies for that comment.',
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
    description: 'User likes a post comment.',
    schema: { type: 'int', example: 1 },
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
  async createCommentLike(
    @Body() info: CreatePostCommentLikeDto,
    @CurrentUser() user: UserTokenPayload,
    @Res() res: Response,
  ) {
    await this.postService.validatePost(user.id, info.postId);

    await this.postCommentService.createCommentLike(user.id, info);

    return res.status(201);
  }

  @Get('like/list/:postId/:commentId')
  @ApiOkResponse({
    type: PostLikeListResponse,
    description: 'User gets the likes belonging to the postId and commentId',
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
    description:
      'User unlikes a post comment. Returns Created when some rows are affected and OK otherwise',
  })
  @IsAuthenticated()
  async removeCommentLike(
    @CurrentUser() user: UserTokenPayload,
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Res() res: Response,
  ) {
    await this.postCommentService.removeCommentLike(user.id, commentId);

    return res.status(202);
  }
}

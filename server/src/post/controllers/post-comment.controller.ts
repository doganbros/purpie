import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
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
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserTokenPayload } from 'src/auth/interfaces/user.interface';
import { ValidationBadRequest } from 'src/utils/decorators/validation-bad-request.decorator';
import { PaginationQuery } from 'types/PaginationQuery';
import { CreatePostCommentDto } from '../dto/create-post-comment.dto';
import { UpdatePostCommentDto } from '../dto/update-comment.dto';
import {
  PostCommentListResponse,
  PostLikeListResponse,
} from '../response/post.response';
import { ErrorTypes } from '../../../types/ErrorTypes';
import { PostCommentService } from '../services/post-comment.service';
import { PostService } from '../services/post.service';
import { CreatePostCommentLikeDto } from '../dto/create-post-comment-like.dto';

@Controller({ version: '1', path: 'post/comment' })
@ApiTags('post/comment')
export class PostCommentController {
  constructor(
    private readonly postService: PostService,
    private readonly postCommentService: PostCommentService,
  ) {}

  @Post('create')
  @ValidationBadRequest()
  @ApiCreatedResponse({
    description: 'User creates a new comment. Returns the comment',
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
    @Param('postId', ParseIntPipe) postId: number,
    @Param() params: Record<string, any>,
    @CurrentUser() user: UserTokenPayload,
  ) {
    await this.postService.validatePost(user.id, postId);

    return this.postCommentService.listComments(user.id, postId, query, params);
  }

  @Put('update')
  @ValidationBadRequest()
  @ApiCreatedResponse({
    description: 'User updates a comment',
    schema: { type: 'string', example: 'OK' },
  })
  @IsAuthenticated()
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

  @Get('count/:postId/:parentId?')
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
  async getCommentCount(
    @Param('postId') postId: string,
    @Param('parentId') parentId: string,
    @CurrentUser() user: UserTokenPayload,
  ) {
    await this.postService.validatePost(user.id, Number(postId));

    return this.postCommentService.getCommentCount(
      Number(postId),
      Number(parentId),
    );
  }

  @Delete('remove/:commentId')
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
  async removeComment(
    @CurrentUser() user: UserTokenPayload,
    @Param('commentId') commentId: string,
  ) {
    const result = await this.postCommentService.removeComment(
      user.id,
      Number(commentId),
    );

    return result.affected === 0 ? 'OK' : 'Created';
  }

  @Post('like/create')
  @ValidationBadRequest()
  @ApiCreatedResponse({
    description: 'User likes a post comment. Returns the like id',
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
  async createCommentLike(
    @Body() info: CreatePostCommentLikeDto,
    @CurrentUser() user: UserTokenPayload,
  ) {
    await this.postService.validatePost(user.id, info.postId);

    const like = await this.postCommentService.createCommentLike(user.id, info);

    return like.id;
  }

  @Get('like/list/:postId/:commentId')
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
  async getCommentLikes(
    @Query() query: PaginationQuery,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @CurrentUser() user: UserTokenPayload,
  ) {
    await this.postService.validatePost(user.id, postId);

    return this.postCommentService.getCommentLikes(postId, commentId, query);
  }

  @Delete('like/remove/:commentId')
  @ApiCreatedResponse({
    description:
      'User unlikes a post comment. Returns Created when some rows are affected and OK otherwise',
    schema: { type: 'string', example: 'OK' },
  })
  @IsAuthenticated()
  async removeCommentLike(
    @CurrentUser() user: UserTokenPayload,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    const result = await this.postCommentService.removeCommentLike(
      user.id,
      commentId,
    );

    return result.affected === 0 ? 'OK' : 'Created';
  }
}

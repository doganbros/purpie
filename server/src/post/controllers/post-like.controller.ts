import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { errorResponseDoc } from 'helpers/error-response-doc';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserTokenPayload } from 'src/auth/interfaces/user.interface';
import { ValidationBadRequest } from 'src/utils/decorators/validation-bad-request.decorator';
import { CreatePostLikeDto } from '../dto/create-post-like.dto';
import { PostService } from '../services/post.service';
import { PostLikeListResponse } from '../response/post.response';
import { PostLikeQuery } from '../dto/post-like.query';
import { ErrorTypes } from '../../../types/ErrorTypes';
import { PostLikeService } from '../services/post-like.service';

@Controller({ version: '1', path: 'post/like' })
@ApiTags('Post Like')
export class PostLikeController {
  constructor(
    private readonly postService: PostService,
    private readonly postLikeService: PostLikeService,
  ) {}

  @Post('create')
  @ValidationBadRequest()
  @ApiCreatedResponse({
    description: 'User likes a post.',
  })
  @ApiOperation({
    summary: 'Create Post Like',
    description: 'Create a post like or dislike with given parameters.',
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
  @ApiForbiddenResponse({
    description: 'Error thrown when the post is not allowed for reaction',
    schema: errorResponseDoc(
      403,
      "This post doesn't allow reactions",
      'POST_REACTION_NOT_ALLOWED',
    ),
  })
  async createPostLike(
    @Body() info: CreatePostLikeDto,
    @CurrentUser() user: UserTokenPayload,
  ) {
    const post = await this.postService.validatePost(user.id, info.postId);

    if (!post.allowReaction)
      throw new ForbiddenException(
        ErrorTypes.POST_REACTION_NOT_ALLOWED,
        `This post doesn't allow reactions`,
      );
    if (info.type === 'dislike' && !post.allowDislike)
      throw new ForbiddenException(
        ErrorTypes.POST_DISLIKE_NOT_ALLOWED,
        `This post doesn't allow dislikes`,
      );

    const like = await this.postLikeService.getPostLike(user.id, info.postId);
    if (like) {
      const positive = info.type !== 'dislike';
      await this.postLikeService.updatePostLike(like, positive);
    } else await this.postLikeService.createPostLike(user.id, info);

    return 'OK';
  }

  @Get('list/:postId')
  @ApiOperation({
    summary: 'List Post Like',
    description: 'List likes or dislikes of post belonging to the postId.',
  })
  @ApiOkResponse({
    type: PostLikeListResponse,
    description: 'List post likes',
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
    @Query() query: PostLikeQuery,
    @Param('postId', ParseUUIDPipe) postId: string,
    @CurrentUser() user: UserTokenPayload,
  ) {
    await this.postService.validatePost(user.id, postId);

    return this.postLikeService.getPostLikes(postId, query);
  }

  @Get('count/:postId')
  @ApiOperation({
    summary: 'Count Post Like',
    description: 'Get the number of likes belonging to the postId.',
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
  @ApiOkResponse({
    description: 'Get count of post likes.',
    schema: { type: 'int', example: 15 },
  })
  @IsAuthenticated()
  async getPostLikeCount(
    @Param('postId', ParseUUIDPipe) postId: string,
    @CurrentUser() user: UserTokenPayload,
  ) {
    await this.postService.validatePost(user.id, postId);

    return this.postLikeService.getPostLikeCount(postId);
  }

  @Delete('remove/:postId')
  @ApiOperation({
    summary: 'Delete Post Like',
    description: 'Unlike a post belonging to postId.',
  })
  @ApiCreatedResponse({
    description: 'Unlikes a post',
    schema: { type: 'string', example: 'OK' },
  })
  @IsAuthenticated()
  async removePostLike(
    @CurrentUser() user: UserTokenPayload,
    @Param('postId', ParseUUIDPipe) postId: string,
  ) {
    const result = await this.postLikeService.removePostLike(user.id, postId);

    return result.affected === 0 ? 'OK' : 'Created';
  }
}

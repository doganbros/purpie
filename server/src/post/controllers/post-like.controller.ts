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
  ApiNotFoundResponse,
  ApiOkResponse,
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
@ApiTags('post/like')
export class PostLikeController {
  constructor(
    private readonly postService: PostService,
    private readonly postLikeService: PostLikeService,
  ) {}

  @Post('create')
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

    return like?.id;
  }

  @Get('list/:postId')
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
    @Query() query: PostLikeQuery,
    @Param('postId', ParseUUIDPipe) postId: string,
    @CurrentUser() user: UserTokenPayload,
  ) {
    await this.postService.validatePost(user.id, postId);

    return this.postLikeService.getPostLikes(postId, query);
  }

  @Get('count/:postId')
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
  async getPostLikeCount(
    @Param('postId', ParseUUIDPipe) postId: string,
    @CurrentUser() user: UserTokenPayload,
  ) {
    await this.postService.validatePost(user.id, postId);

    return this.postLikeService.getPostLikeCount(postId);
  }

  @Delete('remove/:postId')
  @ApiCreatedResponse({
    description:
      'User unlikes a post. Returns Created when some rows are affected and OK otherwise',
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

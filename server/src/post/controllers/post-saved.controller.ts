import {
  Body,
  Controller,
  Delete,
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
import { PaginationQuery } from 'types/PaginationQuery';
import { CreateSavedPostDto } from '../dto/create-saved-post.dto';
import { PostService } from '../services/post.service';
import { MixedPostFeedListResponse } from '../response/post-list-feed.response';
import { PostSavedService } from '../services/post-saved.service';

@Controller({ version: '1', path: 'post/saved' })
@ApiTags('post/saved')
export class PostSavedController {
  constructor(
    private readonly postService: PostService,
    private readonly postSavedService: PostSavedService,
  ) {}

  @Post('create')
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
    await this.postService.validatePost(user.id, info.postId);

    const savedPost = await this.postSavedService.createSavedPost(
      user.id,
      info,
    );

    return savedPost.id;
  }

  @Get('list')
  @IsAuthenticated()
  @ApiOkResponse({
    description: 'User gets posts saved',
    type: MixedPostFeedListResponse,
  })
  async listSavedPost(
    @CurrentUser() user: UserTokenPayload,
    @Query() query: PaginationQuery,
  ) {
    return this.postSavedService.listSavedPost(user.id, query);
  }

  @Delete('remove/:postId')
  @ApiCreatedResponse({
    description:
      'User unlikes a post. Returns Created when some rows are affected and OK otherwise',
    schema: { type: 'string', example: 'OK' },
  })
  @IsAuthenticated()
  async removeSavedPost(
    @CurrentUser() user: UserTokenPayload,
    @Param('postId', ParseUUIDPipe) postId: string,
  ) {
    const result = await this.postSavedService.removeSavedPost(user.id, postId);
    return result.affected === 0 ? 'OK' : 'Created';
  }
}

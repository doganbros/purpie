import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiExcludeEndpoint,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { s3, s3HeadObject } from 'config/s3-storage';
import { errorResponseDoc } from 'helpers/error-response-doc';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserTokenPayload } from 'src/auth/interfaces/user.interface';
import { PostService } from '../services/post.service';
import {
  BasePostFeedList,
  PublicPostFeedListResponse,
} from '../response/post-list-feed.response';
import { ListPostFeedQuery } from '../dto/list-post-feed.query';
import { EditPostDto } from '../dto/edit-post.dto';
import { VideoViewStats } from '../dto/video-view-stats.dto';
import { ErrorTypes } from '../../../types/ErrorTypes';

const {
  S3_VIDEO_POST_DIR = '',
  S3_BUCKET_NAME = '',
  S3_MEETING_RECORDING_DIR = '',
} = process.env;

@Controller({ version: '1', path: 'post' })
@ApiTags('Post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/feed/list')
  @ApiOkResponse({
    description: 'Gets post feed list',
    type: PublicPostFeedListResponse,
  })
  @ApiBadRequestResponse({
    description: 'Error thrown when requested fields are invalid.',
    schema: errorResponseDoc(
      400,
      'List posts with requested payload is invalid.',
      'NOT_VALID',
    ),
  })
  @ApiOperation({
    summary: 'List Post Feed',
    description:
      'Returning list of post feed according to requested payload with pagination.',
  })
  @IsAuthenticated()
  async getPostFeed(
    @Query() query: ListPostFeedQuery,
    @CurrentUser() user: UserTokenPayload,
  ) {
    try {
      return this.postService.getFeedList(query, user.id);
    } catch (err) {
      throw new BadRequestException(
        ErrorTypes.NOT_VALID,
        'List posts with requested payload is invalid.',
      );
    }
  }

  @Get('/feed/detail/:postId')
  @ApiOkResponse({
    description: 'Get a post.',
    type: BasePostFeedList,
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
  @ApiOperation({
    summary: 'Post Detail',
    description:
      'Returning a specific post detail according to requested post id.',
  })
  @IsAuthenticated()
  async getFeedById(
    @Param('postId', ParseUUIDPipe) postId: string,
    @CurrentUser() user: UserTokenPayload,
  ) {
    const result = await this.postService.getPostById(user.id, postId);

    if (!result)
      throw new NotFoundException(
        ErrorTypes.POST_NOT_FOUND,
        'Post not found or unauthorized',
      );

    return result;
  }

  @Put('update/:postId')
  @ApiNoContentResponse({
    description: 'Post updated successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Error thrown when updated field are empty.',
    schema: errorResponseDoc(
      400,
      'Edit Payload empty',
      'EDIT_POST_PAYLOAD_EMPTY',
    ),
  })
  @ApiOperation({
    summary: 'Update Post',
    description: 'Updates a post with requested postId and payload.',
  })
  @IsAuthenticated()
  async editPostById(
    @Param('postId', ParseUUIDPipe) postId: string,
    @CurrentUser() user: UserTokenPayload,
    @Body() editPostPayload: EditPostDto,
    @Res() res: Response,
  ) {
    await this.postService.editPost(postId, user.id, editPostPayload);

    return res.status(204);
  }

  @Delete('remove/:postId')
  @IsAuthenticated()
  @ApiAcceptedResponse({ description: 'Post deleted successfully' })
  @ApiNotFoundResponse({
    description:
      'Error thrown when the post is not found or user does not have the right to access',
    schema: errorResponseDoc(
      404,
      'Post not found or unauthorized',
      'POST_NOT_FOUND',
    ),
  })
  @ApiOperation({
    summary: 'Delete Post',
    description: 'Deletes a post with requested postId.',
  })
  async removePostById(
    @Param('postId', ParseUUIDPipe) postId: string,
    @CurrentUser() user: UserTokenPayload,
    @Res() res: Response,
  ) {
    const result = await this.postService.removePost(user.id, postId);
    if (!result.affected)
      throw new NotFoundException(
        ErrorTypes.POST_NOT_FOUND,
        'Post not found or unauthorized',
      );
    return res.status(202);
  }

  @Get('video/view/:slug/:fileName')
  @ApiOkResponse({
    description: 'View video.',
  })
  @ApiNotFoundResponse({
    description: 'Error thrown when the post video is not found.',
    schema: errorResponseDoc(404, 'Video not found', 'VIDEO_NOT_FOUND'),
  })
  @IsAuthenticated()
  @ApiOperation({
    summary: 'View Video Post',
    description:
      'View video post with requested post slug and file name of video.',
  })
  async viewVideoPost(
    @CurrentUser() user: UserTokenPayload,
    @Param('slug') slug: string,
    @Param('fileName') fileName: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      const postVideo = await this.postService.getPostVideoForUserBySlugAndFileName(
        user.id,
        slug,
        fileName,
      );

      if (!postVideo)
        throw new NotFoundException(
          ErrorTypes.VIDEO_NOT_FOUND,
          'Video not found',
        );

      const creds = {
        Bucket: S3_BUCKET_NAME,
        Key:
          postVideo.post.type === 'meeting'
            ? `${S3_MEETING_RECORDING_DIR}${slug}/${postVideo.fileName}`
            : `${S3_VIDEO_POST_DIR}${postVideo.fileName}`,
      };
      const head = await s3HeadObject(creds);
      const objectStream = s3.getObject(creds).createReadStream();

      const { range } = req.headers;
      const total = head.ContentLength;
      const parts = range?.replace(/bytes=/, '').split('-');
      const [partialStart, partialEnd] = parts || [];

      const start = Number.parseInt(partialStart, 10);
      const end = partialEnd ? Number.parseInt(partialEnd, 10) : total;

      res.setHeader('Content-Range', `bytes ${start}-${end}/${total}`);
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Content-Disposition', `filename=${postVideo.fileName}`);
      if (total) res.setHeader('Content-Length', total);
      if (head.ContentType) res.setHeader('Content-Type', head.ContentType);

      return objectStream.pipe(res);
    } catch (err: any) {
      return res.status(err.statusCode || 500).json(err);
    }
  }

  @Post('video/stats/views')
  @ApiOkResponse({
    description: 'Change video post statistics',
  })
  @ApiNotFoundResponse({
    description: 'Error thrown when the post is not found.',
    schema: errorResponseDoc(404, 'Post not found', 'POST_NOT_FOUND'),
  })
  @ApiOperation({
    summary: 'Change Video Stats',
    description: 'Change video view statistics according to requested payload.',
  })
  @IsAuthenticated()
  async videoViewStats(
    @Body() payload: VideoViewStats,
    @CurrentUser() user: UserTokenPayload,
  ) {
    await this.postService.validatePost(user.id, payload.postId);
    await this.postService.videoViewStats(user.id, payload);
    return 'OK';
  }

  @Delete('remove/video/:postId/:videoName')
  @IsAuthenticated()
  @ApiAcceptedResponse({
    description: 'Video post deleted.',
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
  @ApiOperation({
    summary: 'Delete Video Post',
    description:
      'Delete video post with requested postId and video name params.',
  })
  async removePostVideo(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Param('videoName') videoName: string,
    @CurrentUser() user: UserTokenPayload,
    @Res() res: Response,
  ) {
    await this.postService.removePostVideo(postId, user.id, videoName);

    return res.status(202);
  }

  @Get('featured/user/:userId')
  @ApiExcludeEndpoint()
  @ApiAcceptedResponse({
    description: 'Returns authenticated user featured posts.',
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
  getFeaturedPost(
    @CurrentUser() user: UserTokenPayload,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.postService.getFeaturedPost(userId, user.id);
  }
}

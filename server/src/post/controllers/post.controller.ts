import {
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
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { s3, s3HeadObject } from 'config/s3-storage';
import { errorResponseDoc } from 'helpers/error-response-doc';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserTokenPayload } from 'src/auth/interfaces/user.interface';
import { PostService } from '../services/post.service';
import {
  MixedPostFeedDetail,
  PublicPostFeedListResponse,
} from '../response/post-list-feed.response';
import { ListPostFeedQuery } from '../dto/list-post-feed.query';
import { EditPostDto } from '../dto/edit-post.dto';
import { VideoViewStats } from '../dto/video-view-stats.dto';
import { ErrorTypes } from '../../../types/ErrorTypes';
import { UserLogService } from '../../log/services/user-log.service';

const {
  S3_VIDEO_POST_DIR = '',
  S3_BUCKET_NAME = '',
  S3_MEETING_RECORDING_DIR = '',
} = process.env;

@Controller({ version: '1', path: 'post' })
@ApiTags('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly userLogService: UserLogService,
  ) {}

  @Get('video/view/:slug/:fileName')
  @IsAuthenticated()
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
  @IsAuthenticated()
  async videoViewStats(
    @Body() payload: VideoViewStats,
    @CurrentUser() user: UserTokenPayload,
  ) {
    await this.postService.validatePost(user.id, payload.postId);
    await this.postService.videoViewStats(user.id, payload);
    return 'Created';
  }

  @Get('/list/feed')
  @ApiOkResponse({
    description: 'Gets post feed list',
    type: PublicPostFeedListResponse,
  })
  @IsAuthenticated()
  async getPostFeed(
    @Query() query: ListPostFeedQuery,
    @CurrentUser() user: UserTokenPayload,
  ) {
    return this.postService.getFeedList(query, user.id);
  }

  @Get('/detail/feed/:postId')
  @ApiOkResponse({
    description: 'User gets post by id',
    type: MixedPostFeedDetail,
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
  @IsAuthenticated()
  async editPostById(
    @Param('postId', ParseUUIDPipe) postId: string,
    @CurrentUser() user: UserTokenPayload,
    @Body() editPostPayload: EditPostDto,
  ) {
    await this.postService.editPost(postId, user.id, editPostPayload);

    return 'OK';
  }

  @Delete('remove/:postId')
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
  async removePostById(
    @Param('postId', ParseUUIDPipe) postId: string,
    @CurrentUser() user: UserTokenPayload,
  ) {
    const result = await this.postService.removePost(user.id, postId);
    if (!result.affected)
      throw new NotFoundException(
        ErrorTypes.POST_NOT_FOUND,
        'Post not found or unauthorized',
      );
    return 'OK';
  }

  @Delete('remove/video/:postId/:videoName')
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
  async removePostVideo(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Param('videoName') videoName: string,
    @CurrentUser() user: UserTokenPayload,
  ) {
    await this.postService.removePostVideo(postId, user.id, videoName);

    return 'OK';
  }

  @Get('featured/user/:userId')
  @IsAuthenticated()
  getFeaturedPost(
    @CurrentUser() user: UserTokenPayload,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.postService.getFeaturedPost(userId, user.id);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Post as PostEntity } from 'entities/Post.entity';
import { Express, Response } from 'express';
import { s3HeadObject, s3, s3Storage } from 'config/s3-storage';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { IsClientAuthenticated } from 'src/auth/decorators/client-auth.decorator';
import { UserPayload } from 'src/auth/interfaces/user.interface';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { ValidationBadRequest } from 'src/utils/decorators/validation-bad-request.decorator';
import { CreateVideoDto } from './dto/create-video.dto';
import { VideoService } from './video.service';
import { VideoIdParams } from './dto/video-id.params';
import { VideoUploadClientFeedbackDto } from './dto/video-upload-client-feedback.dto';
import { VideoSlugParams } from './dto/video-slug.params';

const { S3_VIDEO_POST_DIR = '', S3_VIDEO_BUCKET_NAME = '' } = process.env;

@Controller({ path: 'video', version: '1' })
@ApiTags('video')
export class VideoController {
  constructor(private staticVideoService: VideoService) {}

  @Post('create')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('videoFile', {
      storage: s3Storage,
    }),
  )
  @IsAuthenticated()
  @ValidationBadRequest()
  async createVideoPost(
    @Body() videoInfo: CreateVideoDto,
    @CurrentUser() user: UserPayload,
    @UploadedFile() file: Express.MulterS3.File,
  ) {
    const videoPostPayload: Partial<PostEntity> = {
      title: videoInfo.title,
      description: videoInfo.description,
      type: 'video',
      slug: file.key.replace(S3_VIDEO_POST_DIR, ''),
      createdById: user.id,
    };

    const { public: publicVideo, userContactExclusive, channelId } = videoInfo;

    if (channelId) {
      await this.staticVideoService.validateUserChannel(user.id, channelId);
      videoPostPayload.channelId = channelId;
    } else {
      videoPostPayload.public = publicVideo;
      videoPostPayload.userContactExclusive =
        userContactExclusive === true && !publicVideo;
    }

    const videoPost = await this.staticVideoService.createNewVideoPost(
      videoPostPayload,
    );

    this.staticVideoService.sendVideoInfoMail(user, videoPost);

    return videoPost.id;
  }

  @Get('detail/:videoId')
  @IsAuthenticated()
  async getVideoPost(
    @CurrentUser() user: UserPayload,
    @Param() info: VideoIdParams,
  ) {
    const videoPost = await this.staticVideoService.getVideoPostForUserById(
      user.id,
      info.videoId,
    );

    if (!videoPost)
      throw new NotFoundException(
        'Video post not found',
        'VIDEO_POST_NOT_FOUND',
      );

    return videoPost;
  }

  @Get('view/:slug')
  @IsAuthenticated()
  async viewVideoPost(
    @CurrentUser() user: UserPayload,
    @Param() info: VideoSlugParams,
    @Res() res: Response,
  ) {
    try {
      const videoPost = await this.staticVideoService.getVideoPostForUserBySlug(
        user.id,
        info.slug,
      );

      if (!videoPost)
        throw new NotFoundException('Video not found', 'VIDEO_NOT_FOUND');

      const creds = {
        Bucket: S3_VIDEO_BUCKET_NAME,
        Key: `${S3_VIDEO_POST_DIR}${videoPost.slug}`,
      };
      const head = await s3HeadObject(creds);
      const objectStream = s3.getObject(creds).createReadStream();

      res.setHeader('Content-Disposition', `filename=${videoPost.slug}`);
      if (head.ContentType) res.setHeader('Content-Type', head.ContentType);

      return objectStream.pipe(res);
    } catch (err) {
      return res.status(err.statusCode || 500).json(err);
    }
  }

  @Delete('remove/:videoId')
  @IsAuthenticated()
  async removeVideoPost(
    @Param() info: VideoIdParams,
    @CurrentUser() user: UserPayload,
  ) {
    const videoPost = await this.staticVideoService.getVideoPostForUserById(
      user.id,
      info.videoId,
    );

    if (!videoPost)
      throw new NotFoundException('Video not found', 'VIDEO_NOT_FOUND');

    await this.staticVideoService.removeVideoPost(user.id, info.videoId);

    s3.deleteObject({
      Key: `${S3_VIDEO_POST_DIR}${videoPost.slug}`,
      Bucket: S3_VIDEO_BUCKET_NAME,
    });

    return 'OK';
  }

  @Post('client/feedback')
  @IsClientAuthenticated(['manageStream'])
  @ApiOkResponse({
    description:
      "Client sends a feedback about any video processing, it could be a notification to octopus that a meeting's video has been stored. Created is sent to client when the record is created, OK otherwise",
    schema: { type: 'string', example: 'Created' },
  })
  @HttpCode(HttpStatus.OK)
  async videoUploadClientFeedback(@Body() info: VideoUploadClientFeedbackDto) {
    if (!info.type || info.type === 'meeting-recording') {
      const result = await this.staticVideoService.setMeetingRecordingFile(
        info.id,
        info.fileName,
      );

      if (result) return 'Created';
    }

    return 'OK';
  }
}

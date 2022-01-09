import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Post as PostEntity } from 'entities/Post.entity';
import path from 'path';
import { Express } from 'express';
import { s3, s3Storage } from 'config/s3-storage';
import {
  CurrentUser,
  CurrentUserProfile,
} from 'src/auth/decorators/current-user.decorator';
import { IsClientAuthenticated } from 'src/auth/decorators/client-auth.decorator';
import {
  UserProfile,
  UserTokenPayload,
} from 'src/auth/interfaces/user.interface';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { ValidationBadRequest } from 'src/utils/decorators/validation-bad-request.decorator';
import { CreateVideoDto } from './dto/create-video.dto';
import { VideoService } from './video.service';
import { VideoIdParams } from './dto/video-id.params';
import { VideoUploadClientFeedbackDto } from './dto/video-upload-client-feedback.dto';

const { S3_VIDEO_POST_DIR = '', S3_VIDEO_BUCKET_NAME = '' } = process.env;

@Controller({ path: 'video', version: '1' })
@ApiTags('video')
export class VideoController {
  constructor(private staticVideoService: VideoService) {}

  @Post('create')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('videoFile', {
      storage: s3Storage(S3_VIDEO_POST_DIR),
      fileFilter(_: any, file, cb) {
        const { mimetype } = file;

        const isValid = [
          'video/3gpp',
          'video/mp4',
          'video/quicktime',
          'video/webm',
          'video/x-flv',
          'video/mpeg',
        ].includes(mimetype);

        if (!isValid)
          return cb(
            new BadRequestException(
              'Please upload a valid video format',
              'FILE_FORMAT_MUST_BE_VIDEO',
            ),
            false,
          );

        return cb(null, true);
      },
    }),
  )
  @IsAuthenticated([], { injectUserProfile: true })
  @ValidationBadRequest()
  async createVideoPost(
    @Body() videoInfo: CreateVideoDto,
    @CurrentUserProfile() user: UserProfile,
    @UploadedFile() file: Express.MulterS3.File,
  ) {
    const videoPostPayload: Partial<PostEntity> = {
      title: videoInfo.title,
      description: videoInfo.description,
      type: 'video',
      slug: file.key
        .replace(S3_VIDEO_POST_DIR, '')
        .replace(path.extname(file.originalname), ''),
      videoName: file.key.replace(S3_VIDEO_POST_DIR, ''),
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

  @Delete('remove/:videoId')
  @IsAuthenticated()
  async removeVideoPost(
    @Param() info: VideoIdParams,
    @CurrentUser() user: UserTokenPayload,
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
      const result = await this.staticVideoService.setPostVideoFile(
        info.id,
        info.fileName,
      );

      if (result) return 'Created';
    }

    return 'OK';
  }
}

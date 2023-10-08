import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Post as PostEntity } from 'entities/Post.entity';
import path from 'path';
import { Express } from 'express';
import { s3Storage } from 'config/s3-storage';
import { CurrentUserProfile } from 'src/auth/decorators/current-user.decorator';
import { IsClientAuthenticated } from 'src/auth/decorators/client-auth.decorator';
import { UserProfile } from 'src/auth/interfaces/user.interface';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { ValidationBadRequest } from 'src/utils/decorators/validation-bad-request.decorator';
import { CreateVideoDto } from '../dto/create-video.dto';
import { VideoService } from '../services/video.service';
import { VideoUploadClientFeedbackDto } from '../dto/video-upload-client-feedback.dto';
import { User } from '../../../entities/User.entity';
import { PostReaction } from '../../../entities/PostReaction.entity';
import { ErrorTypes } from '../../../types/ErrorTypes';
import { defaultPostSettings } from '../../../entities/data/default-post-settings';
import { errorResponseDoc } from '../../../helpers/error-response-doc';

const { S3_VIDEO_POST_DIR = '' } = process.env;

@Controller({ path: 'video', version: '1' })
@ApiTags('Video')
export class VideoController {
  constructor(private staticVideoService: VideoService) {}

  @Post('create')
  @ApiConsumes('multipart/form-data')
  @ApiBadRequestResponse({
    description:
      'Error thrown when the requested video format invalid. Valid formats: 3gpp, mp4, quicktime, webm, x-flv and mpeg',
    schema: errorResponseDoc(
      400,
      'Please upload a valid video format',
      'INVALID_VIDEO_FORMAT',
    ),
  })
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
              ErrorTypes.INVALID_VIDEO_FORMAT,
              'Please upload a valid video format',
            ),
            false,
          );

        return cb(null, true);
      },
    }),
  )
  @IsAuthenticated([], { injectUserProfile: true })
  @ValidationBadRequest()
  @ApiOkResponse({
    description: 'Upload a video file successfully',
  })
  @ApiOperation({
    summary: 'Create Video Post',
    description:
      'Create a new video post with requested video file and payload.',
  })
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
      allowComment: videoInfo.allowComment || defaultPostSettings.allowComment,
      allowDislike: videoInfo.allowDislike || defaultPostSettings.allowDislike,
      allowReaction:
        videoInfo.allowReaction || defaultPostSettings.allowReaction,
    };

    const { public: publicVideo, channelId } = videoInfo;

    if (channelId) {
      const userChannel = await this.staticVideoService.validateUserChannel(
        user.id,
        channelId,
      );
      videoPostPayload.channelId = channelId;
      videoPostPayload.public = userChannel.channel.public;
    } else {
      videoPostPayload.public = publicVideo;
    }

    videoPostPayload.createdBy = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      displayPhoto: user.displayPhoto,
    } as User;
    videoPostPayload.postReaction = new PostReaction();

    const videoPost = await this.staticVideoService.createNewVideoPost(
      videoPostPayload,
    );

    videoPostPayload.id = videoPost.id;

    await this.staticVideoService.sendVideoInfoMail(user, videoPost);

    return videoPostPayload;
  }

  @ApiExcludeEndpoint()
  @Post('client/feedback')
  @IsClientAuthenticated(['manageStream'])
  @ApiOkResponse({
    description:
      "Client sends a feedback about any video processing, it could be a notification to purpie that a meeting's video has been stored. Created is sent to client when the record is created, OK otherwise",
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

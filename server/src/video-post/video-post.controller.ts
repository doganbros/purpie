import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { promisify } from 'util';
import { ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideoPost } from 'entities/VideoPost.entity';
import { Express, Response } from 'express';
import { AWSError, S3 } from 'aws-sdk';
import { s3, s3Storage } from 'config/s3-storage';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserPayload } from 'src/auth/interfaces/user.interface';
import { UserChannelRole } from 'src/channel/decorators/user-channel-role.decorator';
import { ChannelIdParams } from 'src/channel/dto/channel-id.params';
import { UserZoneRole } from 'src/zone/decorators/user-zone-role.decorator';
import { ZoneIdParams } from 'src/zone/dto/zone-id.params';
import { PaginationQueryParams } from 'src/utils/decorators/pagination-query-params.decorator';
import { PaginationQuery } from 'types/PaginationQuery';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { ValidationBadRequest } from 'src/utils/decorators/validation-bad-request.decorator';
import { CreateVideoPostDto } from './dto/create-video-post.dto';
import { VideoPostService } from './video-post.service';
import { VideoIdParams } from './dto/video-id.params';

const { S3_VIDEO_POST_DIR = '', S3_VIDEO_POST_BUCKET_NAME = '' } = process.env;

@Controller({ path: 'video-post', version: '1' })
@ApiTags('video-post')
export class VideoPostController {
  constructor(private videoPostService: VideoPostService) {}

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
    @Body() videoPostInfo: CreateVideoPostDto,
    @CurrentUser() user: UserPayload,
    @UploadedFile() file: Express.MulterS3.File,
  ) {
    const videoPostPayload: Partial<VideoPost> = {
      title: videoPostInfo.title,
      description: videoPostInfo.description,
      slug: file.key.replace(S3_VIDEO_POST_DIR, ''),
      createdById: user.id,
    };

    const {
      public: publicVideo,
      userContactExclusive,
      channelId,
    } = videoPostInfo;

    if (channelId) {
      await this.videoPostService.validateUserChannel(user.id, channelId);
      videoPostPayload.channelId = channelId;
    } else {
      videoPostPayload.public = publicVideo;
      videoPostPayload.userContactExclusive =
        userContactExclusive === true && !publicVideo;
    }

    const videoPost = await this.videoPostService.createNewVideoPost(
      videoPostPayload,
    );

    this.videoPostService.sendVideoInfoMail(user, videoPost);

    return videoPost.id;
  }

  @Get('detail/:videoId')
  @IsAuthenticated()
  async getVideoPost(
    @CurrentUser() user: UserPayload,
    @Param() info: VideoIdParams,
  ) {
    const videoPost = await this.videoPostService.getVideoPostForUser(
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

  @Get('view/:videoId')
  @IsAuthenticated()
  async viewVideoPost(
    @CurrentUser() user: UserPayload,
    @Param() info: VideoIdParams,
    @Res() res: Response,
  ) {
    const headObject = promisify(
      (
        params: S3.Types.HeadObjectRequest,
        cb: (err: AWSError, data: S3.Types.HeadObjectOutput) => void,
      ) => s3.headObject(params, cb),
    );

    try {
      const videoPost = await this.videoPostService.getVideoPostForUser(
        user.id,
        info.videoId,
      );

      if (!videoPost)
        throw new NotFoundException('Video not found', 'VIDEO_NOT_FOUND');

      const creds = {
        Bucket: S3_VIDEO_POST_BUCKET_NAME,
        Key: `${S3_VIDEO_POST_DIR}${videoPost.slug}`,
      };
      const head = await headObject(creds);
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
    const videoPost = await this.videoPostService.getVideoPostForUser(
      user.id,
      info.videoId,
    );

    if (!videoPost)
      throw new NotFoundException('Video not found', 'VIDEO_NOT_FOUND');

    await this.videoPostService.removeVideoPost(user.id, info.videoId);

    s3.deleteObject({
      Key: `${S3_VIDEO_POST_DIR}${videoPost.slug}`,
      Bucket: S3_VIDEO_POST_BUCKET_NAME,
    });

    return 'OK';
  }

  @Get('list/public')
  @ApiOkResponse({
    description: 'User lists public video posts',
  })
  @PaginationQueryParams()
  @IsAuthenticated()
  async getPublicVideoPosts(@Query() query: PaginationQuery) {
    return this.videoPostService.getPublicVideoPosts(query);
  }

  @Get('list/user')
  @ApiOkResponse({
    description: 'User lists video posts from their contacts and channels',
  })
  @PaginationQueryParams()
  @IsAuthenticated()
  async getUserVideoPosts(
    @CurrentUser() user: UserPayload,
    @Query() query: PaginationQuery,
  ) {
    return this.videoPostService.getUserVideoPosts(user.id, query);
  }

  @Get('list/zone/:zoneId')
  @ApiOkResponse({
    description: 'User lists video posts from channels of this zone',
  })
  @PaginationQueryParams()
  @UserZoneRole()
  async getZoneVideoPosts(
    @CurrentUser() user: UserPayload,
    @Query() query: PaginationQuery,
    @Param() { zoneId }: ZoneIdParams,
  ) {
    return this.videoPostService.getZoneVideoPosts(zoneId, user.id, query);
  }

  @Get('list/channel/:channelId')
  @ApiOkResponse({
    description: 'User lists video posts from this channel',
  })
  @PaginationQueryParams()
  @UserChannelRole()
  async getChannelVideoPosts(
    @CurrentUser() user: UserPayload,
    @Query() query: PaginationQuery,
    @Param() { channelId }: ChannelIdParams,
  ) {
    return this.videoPostService.getChannelVideoPosts(
      channelId,
      user.id,
      query,
    );
  }
}

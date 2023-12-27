import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserTokenPayload } from 'src/auth/interfaces/user.interface';
import { FolderService } from '../services/folder.service';
import { CreatePostFolderDto } from '../dto/create-post-folder.dto';
import { UpdatePostFolderDto } from '../dto/update-post-folder.dto';
import { AddOrRemovePostFolderItemDto } from '../dto/add-or-remove-post-folder-item.dto';
import { PostFolderResponse } from '../response/post.response';
import { errorResponseDoc } from '../../../helpers/error-response-doc';
import { ErrorTypes } from '../../../types/ErrorTypes';

@Controller({ version: '1', path: 'post/folder' })
@ApiTags('Post Folder')
export class PostFolderController {
  constructor(private readonly folderService: FolderService) {}

  @Get('list')
  @IsAuthenticated()
  @ApiOkResponse({
    type: PostFolderResponse,
    isArray: true,
    description: 'List saved posts.',
  })
  @ApiOperation({
    summary: 'List Post Folder',
    description: 'List folders which created for listing saved posts.',
  })
  getUserFolderList(@CurrentUser() user: UserTokenPayload) {
    return this.folderService.getUserPostFolders(user.id);
  }

  @Post('create')
  @IsAuthenticated()
  @ApiOkResponse({
    type: PostFolderResponse,
    description: 'Create new folder.',
  })
  @ApiOperation({
    summary: 'Create Post Folder',
    description: 'Create new folder to save posts.',
  })
  createPostFolder(
    @CurrentUser() user: UserTokenPayload,
    @Body() info: CreatePostFolderDto,
  ) {
    return this.folderService.createFolder(user.id, info);
  }

  @Put('update')
  @ApiNoContentResponse({ description: 'Post folder updated.' })
  @ApiOperation({
    summary: 'Update Post Folder',
    description: 'Update specific folder with requested payload.',
  })
  @IsAuthenticated()
  async updatePostFolder(
    @CurrentUser() user: UserTokenPayload,
    @Body() info: UpdatePostFolderDto,
  ) {
    await this.folderService.updateFolder(user.id, info);

    return 'OK';
  }

  @Delete('remove/:folderId')
  @IsAuthenticated()
  @ApiAcceptedResponse({ description: 'Post folder deleted.' })
  @ApiNotFoundResponse({
    description: 'Error thrown when the post folder is not found.',
    schema: errorResponseDoc(
      404,
      'Post folder not found',
      ErrorTypes.POST_FOLDER_NOT_FOUND,
    ),
  })
  @ApiOperation({
    summary: 'Delete Post Folder',
    description: 'Delete specific folder.',
  })
  async removePostFolder(
    @CurrentUser() user: UserTokenPayload,
    @Param('folderId', ParseUUIDPipe) folderId: string,
  ) {
    await this.folderService.removeFolder(user.id, folderId);

    return 'OK';
  }

  @Post('item/create')
  @ApiOkResponse({
    type: PostFolderResponse,
    description: 'Add requested post to folder',
  })
  @ApiOperation({
    summary: 'Add Post to Folder',
    description: 'Save requested post into requested folder.',
  })
  @ApiNotFoundResponse({
    description: 'Error thrown when the post folder is not found.',
    schema: errorResponseDoc(
      404,
      'Post folder not found',
      ErrorTypes.POST_FOLDER_NOT_FOUND,
    ),
  })
  @ApiBadRequestResponse({
    description: 'Error thrown when the post is not found.',
    schema: errorResponseDoc(400, 'Post not found', ErrorTypes.POST_NOT_FOUND),
  })
  @IsAuthenticated()
  addFolderItem(
    @CurrentUser() user: UserTokenPayload,
    @Body() info: AddOrRemovePostFolderItemDto,
  ) {
    return this.folderService.addFolderItem(user.id, info);
  }

  @Post('item/remove')
  @ApiNotFoundResponse({
    description: 'Error thrown when the post folder item is not found.',
    schema: errorResponseDoc(
      404,
      'Post folder item not found',
      ErrorTypes.POST_FOLDER_ITEM_NOT_FOUND,
    ),
  })
  @ApiAcceptedResponse({ description: 'Folder post deleted' })
  @IsAuthenticated()
  @ApiOperation({
    summary: 'Remove Post from Folder',
    description: 'Remove requested post into requested folder.',
  })
  async removeFolderItem(
    @CurrentUser() user: UserTokenPayload,
    @Body() info: AddOrRemovePostFolderItemDto,
  ) {
    await this.folderService.removeFolderItem(user.id, info);

    return 'OK';
  }
}

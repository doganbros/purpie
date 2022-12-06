import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserTokenPayload } from 'src/auth/interfaces/user.interface';
import { PaginationQuery } from 'types/PaginationQuery';
import { FolderService } from '../services/folder.service';
import { CreatePostFolderDto } from '../dto/create-post-folder.dto';
import { UpdatePostFolderDto } from '../dto/update-post-folder.dto';
import { AddOrRemovePostFolderItemDto } from '../dto/add-or-remove-post-folder-item.dto';

@Controller({ version: '1', path: 'post/folder' })
@ApiTags('post/folder')
export class PostFolderController {
  constructor(private readonly folderService: FolderService) {}

  @Get('list')
  @IsAuthenticated()
  getUserFolderList(@CurrentUser() user: UserTokenPayload) {
    return this.folderService.getUserPostFolders(user.id);
  }

  @Post('create')
  @IsAuthenticated()
  createPostFolder(
    @CurrentUser() user: UserTokenPayload,
    @Body() info: CreatePostFolderDto,
  ) {
    return this.folderService.createFolder(user.id, info);
  }

  @Put('update')
  @IsAuthenticated()
  updatePostFolder(
    @CurrentUser() user: UserTokenPayload,
    @Body() info: UpdatePostFolderDto,
  ) {
    return this.folderService.updateFolder(user.id, info);
  }

  @Delete('remove/:folderId')
  @IsAuthenticated()
  async removePostFolder(
    @CurrentUser() user: UserTokenPayload,
    @Param('folderId', ParseIntPipe) folderId: number,
  ) {
    await this.folderService.removeFolder(user.id, folderId);

    return 'OK';
  }

  @Post('item/create')
  @IsAuthenticated()
  addFolderItem(
    @CurrentUser() user: UserTokenPayload,
    @Body() info: AddOrRemovePostFolderItemDto,
  ) {
    return this.folderService.addFolderItem(user.id, info);
  }

  @Post('item/remove')
  @IsAuthenticated()
  removeFolderItem(
    @CurrentUser() user: UserTokenPayload,
    @Body() info: AddOrRemovePostFolderItemDto,
  ) {
    return this.folderService.removeFolderItem(user.id, info);
  }
}

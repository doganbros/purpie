import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserChannel } from 'entities/UserChannel.entity';
import { Repository } from 'typeorm';
import { PostService } from './post.service';
import { ErrorTypes } from '../../../types/ErrorTypes';
import { PostFolder } from '../../../entities/PostFolder.entity';
import { PostFolderItem } from '../../../entities/PostFolderItem.entity';
import { CreatePostFolderDto } from '../dto/create-post-folder.dto';
import { UpdatePostFolderDto } from '../dto/update-post-folder.dto';
import { AddOrRemovePostFolderItemDto } from '../dto/add-or-remove-post-folder-item.dto';

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(PostFolder)
    private folderRepository: Repository<PostFolder>,
    @InjectRepository(PostFolderItem)
    private folderItemRepository: Repository<PostFolderItem>,
    @InjectRepository(UserChannel)
    private userChannelRepository: Repository<UserChannel>,
    private postService: PostService,
  ) {}

  async getUserPostFolders(userId: string) {
    return this.folderRepository
      .createQueryBuilder('folder')
      .addSelect(
        (sq) =>
          sq
            .select('cast(count(*) as int)')
            .from(PostFolderItem, 'folderItem')
            .where('folderItem.folderId = folder.id'),
        'folder_itemCount',
      )
      .leftJoinAndSelect('folder.folderItems', 'folderItems')
      .leftJoinAndSelect('folderItems.post', 'post')
      .where('folder.createdById = :userId', { userId })
      .getMany();
  }

  async createFolder(userId: string, info: CreatePostFolderDto) {
    const payload: Partial<PostFolder> = {
      title: info.title,
      createdById: userId,
    };

    const folder = await this.folderRepository.create(payload).save();

    if (info.postId) {
      await this.folderItemRepository
        .create({
          folderId: folder.id,
          postId: info.postId,
        })
        .save();
    }

    folder.folderItems = [];
    return folder;
  }

  async updateFolder(userId: string, info: UpdatePostFolderDto) {
    const payload: Partial<PostFolder> = {};

    if (info.title) {
      payload.title = info.title;
    }

    await this.folderRepository.update(
      { id: info.folderId, createdById: userId },
      payload,
    );
  }

  async removeFolder(userId: string, folderId: string) {
    const folder = await this.folderRepository.findOne({
      where: { id: folderId },
      select: ['id', 'createdById'],
    });

    if (!folder)
      throw new NotFoundException(
        ErrorTypes.POST_FOLDER_NOT_FOUND,
        'Post folder not found',
      );

    if (folder.createdById && folder.createdById !== userId)
      throw new NotFoundException(
        ErrorTypes.POST_FOLDER_NOT_FOUND,
        'Post folder not found',
      );

    return this.folderRepository.delete({ id: folderId });
  }

  async addFolderItem(userId: string, info: AddOrRemovePostFolderItemDto) {
    const folder = await this.folderRepository.findOne({
      where: { id: info.folderId },
      select: ['id', 'createdById'],
    });

    if (!folder)
      throw new NotFoundException(
        ErrorTypes.POST_FOLDER_NOT_FOUND,
        'Post folder not found',
      );

    if (folder.createdById && folder.createdById !== userId)
      throw new NotFoundException(
        ErrorTypes.POST_FOLDER_NOT_FOUND,
        'Post folder not found',
      );

    const post = await this.postService.getPostById(userId, info.postId);

    if (!post)
      throw new NotFoundException(ErrorTypes.POST_NOT_FOUND, 'Post not found');

    const folderItem = await this.folderItemRepository
      .create({
        postId: info.postId,
        folderId: info.folderId,
      })
      .save();

    folderItem.post = post;
    return folderItem;
  }

  async removeFolderItem(userId: string, info: AddOrRemovePostFolderItemDto) {
    const folderItem = await this.folderItemRepository.findOne({
      where: { postId: info.postId, folderId: info.folderId },
      relations: ['folder'],
    });

    if (!folderItem)
      throw new NotFoundException(
        ErrorTypes.POST_FOLDER_ITEM_NOT_FOUND,
        'Post folder item not found',
      );

    const { folder } = folderItem;

    if (folder.createdById && folder.createdById !== userId)
      throw new NotFoundException(
        ErrorTypes.POST_FOLDER_ITEM_NOT_FOUND,
        'Post folder item not found',
      );

    return this.folderItemRepository.delete({
      postId: info.postId,
      folderId: info.folderId,
    });
  }
}

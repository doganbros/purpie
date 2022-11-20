import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserChannel } from 'entities/UserChannel.entity';
import { Repository } from 'typeorm';
import { PaginationQuery } from 'types/PaginationQuery';
import { PostService } from './post.service';
import { ErrorTypes } from '../../../types/ErrorTypes';
import { PostFolder } from '../../../entities/PostFolder.entity';
import { PostFolderItem } from '../../../entities/PostFolderItem.entity';
import { CreatePostFolderDto } from '../dto/create-post-folder.dto';
import { UpdatePostFolderDto } from '../dto/update-post-folder.dto';
import { AddPostFolderItemDto } from '../dto/add-post-folder-item.dto';

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

  async getUserPostFolders(userId: number, query: PaginationQuery) {
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
      .where('folder.createdById = :userId', { userId })
      .paginate(query);
  }

  async createFolder(userId: number, info: CreatePostFolderDto) {
    const payload: Partial<PostFolder> = {
      title: info.title,
      createdById: userId,
      description: info.description ?? null,
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

    return folder;
  }

  async updateFolder(userId: number, info: UpdatePostFolderDto) {
    const payload: Partial<PostFolder> = {};

    if (info.description) {
      payload.description = info.description;
    }

    if (info.title) {
      payload.title = info.title;
    }

    await this.folderRepository.update(
      { id: info.folderId, createdById: userId },
      payload,
    );
  }

  async removeFolder(userId: number, folderId: number) {
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

  async addFolderItem(userId: number, info: AddPostFolderItemDto) {
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

    return this.folderItemRepository
      .create({
        postId: info.postId,
        folderId: info.folderId,
      })
      .save();
  }

  async removeFolderItem(userId: number, folderItemId: number) {
    const folderItem = await this.folderItemRepository.findOne({
      where: { id: folderItemId },
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

    return this.folderItemRepository.delete({ id: folderItemId });
  }
}

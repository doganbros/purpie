import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from 'entities/Playlist.entity';
import { PlaylistItem } from 'entities/PlaylistItem.entity';
import { UserChannel } from 'entities/UserChannel.entity';
import { Repository } from 'typeorm';
import { PaginationQuery } from 'types/PaginationQuery';
import { AddPlaylistItemDto } from '../dto/add-playlist-item.dto';
import { CreatePlaylistDto } from '../dto/create-playlist.dto';
import { UpdatePlaylistDto } from '../dto/update-playlist.dto';
import { PostService } from './post.service';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
    @InjectRepository(PlaylistItem)
    private playlistItemRepository: Repository<PlaylistItem>,
    @InjectRepository(UserChannel)
    private userChannelRepository: Repository<UserChannel>,
    private postService: PostService,
  ) {}

  async getUserPlaylists(userId: number, query: PaginationQuery) {
    return this.playlistRepository
      .createQueryBuilder('playlist')
      .addSelect(
        (sq) =>
          sq
            .select('cast(count(*) as int)')
            .from(PlaylistItem, 'playlistItem')
            .where('playlistItem.playlistId = playlist.id'),
        'playlist_itemCount',
      )
      .where('playlist.createdById = :userId', { userId })
      .andWhere('playlist.channelId is null')
      .paginate(query);
  }

  async getPublicUserPlaylists(userId: number, query: PaginationQuery) {
    return this.playlistRepository
      .createQueryBuilder('playlist')
      .addSelect(
        (sq) =>
          sq
            .select('cast(count(*) as int)')
            .from(PlaylistItem, 'playlistItem')
            .where('playlistItem.playlistId = playlist.id'),
        'playlist_itemCount',
      )
      .where('playlist.createdById = :userId', { userId })
      .andWhere('playlist.public = true')
      .andWhere('playlist.channelId is null')
      .paginate(query);
  }

  async getChannelPlaylists(channelId: number, query: PaginationQuery) {
    return this.playlistRepository
      .createQueryBuilder('playlist')
      .addSelect(
        (sq) =>
          sq
            .select('cast(count(*) as int)')
            .from(PlaylistItem, 'playlistItem')
            .where('playlistItem.playlistId = playlist.id'),
        'playlist_itemCount',
      )
      .where('playlist.channelId = :channelId', { channelId })
      .paginate(query);
  }

  async createPlaylist(userId: number, info: CreatePlaylistDto) {
    const payload: Partial<Playlist> = {
      title: info.title,
      public: info.public ?? true,
      createdById: userId,
      description: info.description ?? null,
    };

    if (info.channelId) {
      const isUserInChannel = await this.userChannelRepository.findOne({
        where: { channelId: info.channelId, userId },
        select: ['id'],
      });

      if (!isUserInChannel)
        throw new UnauthorizedException(
          `User is not a member of the channel with the id ${info.channelId}`,
          'USER_NOT_CHANNEL_MEMBER',
        );

      payload.channelId = info.channelId;
    }

    const playlist = await this.playlistRepository.create(payload).save();

    if (info.postId) {
      await this.playlistItemRepository
        .create({
          playlistId: playlist.id,
          postId: info.postId,
        })
        .save();
    }

    return playlist;
  }

  async updatePlaylist(userId: number, info: UpdatePlaylistDto) {
    const payload: Partial<Playlist> = {};

    if (info.description) {
      payload.description = info.description;
    }

    if (info.title) {
      payload.title = info.title;
    }

    if (info.public !== undefined) {
      payload.public = info.public;
    }

    await this.playlistRepository.update(
      { id: info.playlistId, createdById: userId },
      payload,
    );
  }

  async addPlaylistItem(userId: number, info: AddPlaylistItemDto) {
    const playlist = await this.playlistRepository.findOne({
      where: { id: info.playlistId },
      select: ['id', 'channelId', 'createdById'],
    });

    if (!playlist)
      throw new NotFoundException('Playlist not found', 'PLAYLIST_NOT_FOUND');

    if (
      playlist.createdById &&
      !playlist.channelId &&
      playlist.createdById !== userId
    )
      throw new NotFoundException('Playlist not found', 'PLAYLIST_NOT_FOUND');

    const post = await this.postService.getPostById(userId, info.postId);

    if (!post) throw new NotFoundException('Post not found', 'POST_NOT_FOUND');

    if (playlist.channelId) {
      if (post.channelId !== playlist.channelId)
        throw new UnauthorizedException('NOT_AUTHROIZED');

      const userChannel = await this.userChannelRepository.findOne({
        where: { channelId: playlist.channelId, userId },
        relations: ['channelRole'],
      });

      if (!userChannel)
        throw new NotFoundException('Playlist not found', 'PLAYLIST_NOT_FOUND');

      if (!userChannel.channelRole.canEdit)
        throw new UnauthorizedException('NOT_AUTHROIZED');
    }

    const playlistItem = await this.playlistItemRepository
      .create({
        postId: info.postId,
        playlistId: info.playlistId,
      })
      .save();

    return playlistItem;
  }

  async removePlaylist(userId: number, playlistId: number) {
    const playlist = await this.playlistRepository.findOne({
      where: { id: playlistId },
      select: ['id', 'channelId', 'createdById'],
    });

    if (!playlist)
      throw new NotFoundException('Playlist not found', 'PLAYLIST_NOT_FOUND');

    if (
      playlist.createdById &&
      !playlist.channelId &&
      playlist.createdById !== userId
    )
      throw new NotFoundException('Playlist not found', 'PLAYLIST_NOT_FOUND');

    if (playlist.channelId) {
      const userChannel = await this.userChannelRepository.findOne({
        where: { channelId: playlist.channelId, userId },
        relations: ['channelRole'],
      });

      if (!userChannel)
        throw new NotFoundException('Playlist not found', 'PLAYLIST_NOT_FOUND');

      if (!userChannel.channelRole.canEdit)
        throw new UnauthorizedException('NOT_AUTHROIZED');
    }

    return this.playlistRepository.delete({ id: playlistId });
  }

  async removePlaylistItem(userId: number, playlistItemId: number) {
    const playlistItem = await this.playlistItemRepository.findOne({
      where: { id: playlistItemId },
      relations: ['playlist'],
    });

    if (!playlistItem)
      throw new NotFoundException(
        'Playlist item not found',
        'PLAYLIST_ITEM_NOT_FOUND',
      );

    const { playlist } = playlistItem;

    if (
      playlist.createdById &&
      !playlist.channelId &&
      playlist.createdById !== userId
    )
      throw new NotFoundException(
        'Playlist item not found',
        'PLAYLIST_ITEM_NOT_FOUND',
      );

    if (playlist.channelId) {
      const userChannel = await this.userChannelRepository.findOne({
        where: { channelId: playlist.channelId, userId },
        relations: ['channelRole'],
      });

      if (!userChannel)
        throw new NotFoundException(
          'Playlist item not found',
          'PLAYLIST_ITEM_NOT_FOUND',
        );

      if (!userChannel.channelRole.canEdit)
        throw new UnauthorizedException('NOT_AUTHROIZED');
    }

    return this.playlistItemRepository.delete({ id: playlistItemId });
  }
}

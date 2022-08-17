import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddPlaylistItemDto {
  @ApiProperty()
  @IsInt()
  playlistId: number;

  @ApiProperty()
  @IsInt()
  postId: number;
}

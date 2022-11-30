import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddPostFolderItemDto {
  @ApiProperty()
  @IsInt()
  folderId: number;

  @ApiProperty()
  @IsInt()
  postId: number;
}

import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddOrRemovePostFolderItemDto {
  @ApiProperty()
  @IsInt()
  folderId: number;

  @ApiProperty()
  @IsInt()
  postId: number;
}

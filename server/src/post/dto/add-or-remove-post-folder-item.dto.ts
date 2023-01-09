import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddOrRemovePostFolderItemDto {
  @ApiProperty()
  @IsUUID()
  folderId: string;

  @ApiProperty()
  @IsUUID()
  postId: string;
}

import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostFolderDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({
    required: false,
    description: 'This is the first post that will be added to the folder',
  })
  @IsUUID()
  @IsOptional()
  postId: string;
}

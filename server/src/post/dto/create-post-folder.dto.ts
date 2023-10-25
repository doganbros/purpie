import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostFolderDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description:
      'This is the first post that will be added to the folder when creating first time.',
  })
  @IsUUID()
  @IsOptional()
  postId: string | null;
}

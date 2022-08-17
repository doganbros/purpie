import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlaylistDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  public: boolean;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  channelId: number;

  @ApiProperty({
    required: false,
    description: 'This is the first post that will be added to the playlist',
  })
  @IsInt()
  @IsOptional()
  postId: number;
}

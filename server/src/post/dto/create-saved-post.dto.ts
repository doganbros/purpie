import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSavedPostDto {
  @ApiProperty()
  @IsInt()
  postId: number;
}

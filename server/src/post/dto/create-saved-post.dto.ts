import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSavedPostDto {
  @ApiProperty()
  @IsUUID()
  postId: string;
}

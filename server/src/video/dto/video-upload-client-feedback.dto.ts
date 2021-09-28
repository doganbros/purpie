import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const feedbackTypes = ['meeting-recording'] as const;
export class VideoUploadClientFeedbackDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ enum: feedbackTypes })
  @IsIn(feedbackTypes)
  @IsOptional()
  type: typeof feedbackTypes[number];

  @ApiProperty()
  @IsNotEmpty()
  fileName: string;
}

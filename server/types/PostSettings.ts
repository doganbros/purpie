import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class PostSettings {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  allowReaction: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  allowDislike: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  allowComment: boolean;
}

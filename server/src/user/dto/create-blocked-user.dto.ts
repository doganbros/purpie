import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlockedUserDto {
  @ApiProperty()
  @IsUUID()
  userId: string;
}

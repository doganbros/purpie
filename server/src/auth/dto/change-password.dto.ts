import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty()
  @MinLength(6)
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty()
  @MinLength(6)
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty()
  @MinLength(6)
  @IsNotEmpty()
  confirmNewPassword: string;
}

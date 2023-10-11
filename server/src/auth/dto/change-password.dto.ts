import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ minLength: 6 })
  @MinLength(6)
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({ minLength: 6 })
  @MinLength(6)
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty({ minLength: 6 })
  @MinLength(6)
  @IsNotEmpty()
  confirmNewPassword: string;
}

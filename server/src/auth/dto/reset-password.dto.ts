import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ minLength: 6 })
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description:
      'A JWT token when generated from request-reset-password endpoint.',
  })
  @IsNotEmpty()
  token: string;
}

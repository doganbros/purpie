import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateZoneDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: false,
  })
  @IsInt()
  @IsOptional()
  categoryId?: number;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    minimum: 6,
    maximum: 64,
    pattern: '/^(?![0-9]+$)(?!.*-$)(?!-)[a-zA-Z0-9-]{6,32}$/g',
    description:
      'Subdomain which will be used as zone address. See: https://datatracker.ietf.org/doc/html/rfc1035',
  })
  @IsNotEmpty()
  @Matches(/^(?![0-9]+$)(?!.*-$)(?!-)[a-zA-Z0-9-]{6,32}$/, {
    message: 'Please enter a valid subdomain',
  })
  subdomain: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public?: boolean;
}

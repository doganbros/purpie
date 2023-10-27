import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class EditChannelDto {
  @ApiPropertyOptional({ maxLength: 32 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  @IsOptional()
  name: string;

  @ApiPropertyOptional({
    maxLength: 256,
  })
  @IsString()
  @IsOptional()
  @MaxLength(256)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  public?: boolean;
}

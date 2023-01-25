import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ContactIdParam {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  contactId: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class ChatCountResponse {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  count: number;
}

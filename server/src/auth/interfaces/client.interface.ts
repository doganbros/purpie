import { ApiProperty } from '@nestjs/swagger';
import { ClientRole } from 'entities/ClientRole.entity';
import { SoftEntity } from 'types/SoftEntity';

export class ClientApiCredential {
  @ApiProperty()
  apiKey: string;

  @ApiProperty()
  apiSecret: string;
}

export class ClientPayload {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({
    type: 'object',
    properties: {
      roleCode: {
        type: 'string',
        example: 'SUPER_ADMIN',
        enum: ['SUPER_ADMIN', 'ADMIN', 'NORMAL'],
      },
      roleName: { type: 'string', example: 'Super Admin' },
      manageMeeting: { type: 'boolean' },
    },
  })
  clientRole: SoftEntity<ClientRole>;
}

export class ClientTokens {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

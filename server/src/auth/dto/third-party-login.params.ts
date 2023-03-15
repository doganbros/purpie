import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty } from 'class-validator';

const supportedThirdParties = ['google', 'apple'] as const;

export class ThirdPartyLoginParams {
  @IsNotEmpty()
  @ApiProperty()
  @IsIn(supportedThirdParties)
  name: typeof supportedThirdParties[number];
}

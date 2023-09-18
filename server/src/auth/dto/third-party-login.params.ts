import { IsIn, IsNotEmpty } from 'class-validator';

const supportedThirdParties = ['google', 'apple'] as const;

export class ThirdPartyLoginParams {
  @IsNotEmpty()
  @IsIn(supportedThirdParties)
  name: typeof supportedThirdParties[number];
}

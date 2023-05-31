import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { MembershipService } from '../services/membership.service';
import { CurrentUserAccessToken } from '../../auth/decorators/current-user.decorator';

@Controller({ path: 'membership', version: '1' })
@ApiTags('membership')
export class MembershipController {
  constructor(private membershipService: MembershipService) {}

  @Get('/list')
  @ApiOkResponse({
    description: 'Membership lists ',
  })
  @IsAuthenticated()
  async listMemberships(@CurrentUserAccessToken() accessToken: string) {
    return this.membershipService.listMemberships(accessToken);
  }
}

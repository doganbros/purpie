import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { MembershipService } from '../services/membership.service';

@Controller({ path: 'membership', version: '1' })
@ApiTags('membership')
export class MembershipController {
  constructor(private membershipService: MembershipService) {}

  @Get('/list')
  @ApiOkResponse({
    description: 'Membership lists ',
  })
  @IsAuthenticated()
  // async listMemberships(@CurrentUserAccessToken() accessToken: string) {
  async listMemberships() {
    return this.membershipService.listMemberships();
  }
}

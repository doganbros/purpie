import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiExcludeController, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { MembershipService } from '../services/membership.service';
import {
  CurrentUser,
  CurrentUserProfile,
} from '../../auth/decorators/current-user.decorator';
import {
  UserProfile,
  UserTokenPayload,
} from '../../auth/interfaces/user.interface';

@Controller({ path: 'membership', version: '1' })
@ApiExcludeController()
@ApiTags('membership')
export class MembershipController {
  constructor(private membershipService: MembershipService) {}

  @Get('/list')
  @ApiOkResponse({
    description: 'Membership lists ',
  })
  @IsAuthenticated()
  async listMemberships() {
    return this.membershipService.listMemberships();
  }

  @Get('/user')
  @ApiOkResponse({
    description: 'Authenticated user membership info',
  })
  @IsAuthenticated([], { injectUserProfile: true })
  async getUserMembership(@CurrentUserProfile() userProfile: UserProfile) {
    return this.membershipService.getUserMembership(
      userProfile.id,
      userProfile.email,
    );
  }

  @Post('/payment/create-session')
  @ApiOkResponse({
    description: 'Create payment for user membership',
  })
  @IsAuthenticated()
  async createPaymentSession(
    @CurrentUser() user: UserTokenPayload,
    @Body() req: { membershipId: string },
  ) {
    return this.membershipService.createPaymentSession(
      user.id,
      req.membershipId,
    );
  }

  @Get('/payment/customer-portal')
  @ApiOkResponse({
    description: 'Create customer portal link for user',
  })
  @IsAuthenticated()
  async createCustomerPortal(@CurrentUser() user: UserTokenPayload) {
    return this.membershipService.createCustomerPortal(user.id);
  }
}

import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { IsAuthenticated } from 'src/auth/decorators/auth.decorator';
import { Response } from 'express';
import { MembershipService } from '../services/membership.service';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { UserTokenPayload } from '../../auth/interfaces/user.interface';

@Controller({ path: 'membership', version: '1' })
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
  @IsAuthenticated()
  async getUserMembership(@CurrentUser() user: UserTokenPayload) {
    return this.membershipService.getUserMembership(user.id);
  }

  @Post('/payment/create-session')
  @ApiOkResponse({
    description: 'Create payment for user membership',
  })
  @IsAuthenticated()
  async createPaymentSession(
    @CurrentUser() user: UserTokenPayload,
    @Body() req: { membershipId: string },
    @Res() res: Response,
  ) {
    try {
      const url = await this.membershipService.createPaymentSession(
        user.id,
        req.membershipId,
      );
      return res.redirect(url, 303);
    } catch (e) {
      res.status(400);
      return res.send({
        error: {
          message: e.message,
        },
      });
    }
  }

  @Post('/payment/customer-portal')
  @ApiOkResponse({
    description: 'Create customer portal link for user',
  })
  @IsAuthenticated()
  async createCustomerPortal(
    @CurrentUser() user: UserTokenPayload,
    @Res() res: Response,
  ) {
    try {
      const url = await this.membershipService.createCustomerPortal(user.id);
      return res.redirect(url, 303);
    } catch (e) {
      res.status(400);
      return res.send({
        error: {
          message: e.message,
        },
      });
    }
  }
}

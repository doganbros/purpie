import { Injectable } from '@nestjs/common';
import axios from 'axios';

const { MEMBERSHIP_URL, MEMBERSHIP_API_SECRET } = process.env;

@Injectable()
export class MembershipService {
  async listMemberships() {
    const membership = await axios({
      url: `${MEMBERSHIP_URL}v1/membership/list`,
      method: 'get',
      headers: { secret: MEMBERSHIP_API_SECRET },
    });

    return membership.data;
  }

  async getUserMembership(userId: string) {
    const membership = await axios({
      url: `${MEMBERSHIP_URL}v1/membership/user/${userId}`,
      method: 'get',
      headers: { secret: MEMBERSHIP_API_SECRET },
    });

    return membership.data;
  }

  async createUserMembership(userId: string, email: string) {
    await axios({
      url: `${MEMBERSHIP_URL}v1/membership/user/create`,
      method: 'post',
      headers: { secret: MEMBERSHIP_API_SECRET },
      data: {
        userId,
        email,
      },
    });
  }

  async createPaymentSession(
    userId: string,
    membershipId: string,
  ): Promise<string> {
    const response = await axios({
      url: `${MEMBERSHIP_URL}v1/payment/create-checkout-session`,
      method: 'post',
      headers: { secret: MEMBERSHIP_API_SECRET },
      data: {
        userId,
        membershipId,
      },
    });

    return response.data.paymentUrl;
  }

  async createCustomerPortal(userId: string): Promise<string> {
    const response = await axios({
      url: `${MEMBERSHIP_URL}v1/payment/customer-portal`,
      method: 'post',
      headers: { secret: MEMBERSHIP_API_SECRET },
      data: {
        userId,
      },
    });

    return response.data.url;
  }
}
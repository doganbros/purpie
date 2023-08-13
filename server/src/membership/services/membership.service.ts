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

  async getUserMembership(userId: string, userEmail?: string) {
    const membership = await axios({
      url: `${MEMBERSHIP_URL}v1/membership/user/${userId}`,
      method: 'get',
      headers: { secret: MEMBERSHIP_API_SECRET },
    });

    if (!membership.data && userEmail) {
      const a = await this.createUserMembership(userId, userEmail);
      console.log('sdfsdf: ', a);
      return a;
    }

    return membership.data;
  }

  async createUserMembership(userId: string, email: string) {
    const response = await axios({
      url: `${MEMBERSHIP_URL}v1/membership/user/create`,
      method: 'post',
      headers: { secret: MEMBERSHIP_API_SECRET },
      data: {
        userId,
        email,
      },
    });

    return response.data;
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

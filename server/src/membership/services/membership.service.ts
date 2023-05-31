import { Injectable } from '@nestjs/common';
import { dummyMemberships } from './dummy-memberships';

@Injectable()
export class MembershipService {
  async listMemberships() {
    // TODO send request to membership microservice to get membership data with userToken
    return dummyMemberships;
  }
}

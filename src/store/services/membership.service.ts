import { http } from '../../config/http';
import { Membership } from '../types/membership.types';

export const listMemberships = async (): Promise<Membership[]> =>
  http.get('/membership/list').then((res) => res.data);

export const getUserMembership = async (): Promise<Membership> =>
  http.get('/membership/user').then((res) => res.data);

export const createPaymentSession = async (
  membershipId: string
): Promise<string> =>
  http
    .post('/membership/payment/create-session', { membershipId })
    .then((res) => res.data);

export const getCustomerPortal = async (): Promise<string> =>
  http.get('/membership/payment/customer-portal').then((res) => res.data);

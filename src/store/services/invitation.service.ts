import { http } from '../../config/http';
import { InvitationResponse } from '../types/invitation.types';
import { User } from '../types/auth.types';
import { InvitationType } from '../../models/utils';

export const responseInvitation = async (
  payload: InvitationResponse
): Promise<User> => {
  // TODO refactor contact invitation response payload
  const request: any = {
    status: payload.response,
  };
  let endpoint = '';
  if (payload.type === InvitationType.CHANNEL) {
    request.invitationId = payload.id;
    endpoint = '/channel/invitation/response';
  } else if (payload.type === InvitationType.ZONE) {
    request.invitationId = payload.id;
    endpoint = '/zone/invitation/response';
  } else {
    request.contactInvitationId = payload.id;
    endpoint = '/user/contact/invitation/response';
  }

  return http.post(endpoint, request).then((res) => res.data);
};

export const createInvitation = (email: string): Promise<string> =>
  http
    .post('/user/contact/invitation/create', { email })
    .then((res) => res.data);

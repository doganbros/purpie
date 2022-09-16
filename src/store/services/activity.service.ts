import { http } from '../../config/http';
import { PaginatedResponse } from '../../models/paginated-response';
import {
  ChannelSuggestionListItem,
  InvitationResponse,
  ZoneSuggestionListItem,
} from '../types/activity.types';
import { User } from '../types/auth.types';
import { InvitationType } from '../../models/utils';

export const getZoneSuggestions = (
  limit: number,
  skip: number
): Promise<PaginatedResponse<ZoneSuggestionListItem>> =>
  http
    .get('/activity/list/suggestions/zone', { params: { limit, skip } })
    .then((res) => res.data);

export const getChannelSuggestions = (
  limit: number,
  skip: number
): Promise<PaginatedResponse<ChannelSuggestionListItem>> =>
  http
    .get('/activity/list/suggestions/channels', { params: { limit, skip } })
    .then((res) => res.data);

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

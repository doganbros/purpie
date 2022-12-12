import { http } from '../../config/http';
import { PaginatedResponse } from '../../models/paginated-response';
import {
  ChannelSuggestionListItem,
  NotificationCount,
  ContactSuggestionListItem,
  InvitationResponse,
  ZoneSuggestionListItem,
  NotificationListItem,
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

export const getContactSuggestions = (): Promise<ContactSuggestionListItem[]> =>
  http.get('/activity/list/suggestions/contact').then((res) => res.data);

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

export const getNotifications = (
  limit: number,
  skip?: number,
  type?: 'all' | 'unread' | 'read'
): Promise<PaginatedResponse<NotificationListItem>> =>
  http
    .get('/notification/list', { params: { limit, skip, type } })
    .then((res) => res.data);

export const getNotificationCount = (): Promise<NotificationCount> =>
  http.get('/notification/count').then((res) => res.data);

export const viewNotifications = (notificationIds: number[]): Promise<string> =>
  http
    .post('/notification/view', null, { params: { notificationIds } })
    .then((res) => res.data);

export const readNotification = (notificationId: number): Promise<string> =>
  http.post(`/notification/read/${notificationId}`).then((res) => res.data);

export const createInvitation = (email: string): Promise<string> =>
  http
    .post('/user/contact/invitation/create', { email })
    .then((res) => res.data);

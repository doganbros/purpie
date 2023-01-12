import { http } from '../../config/http';
import { PaginatedResponse } from '../../models/paginated-response';
import {
  ChannelSuggestionListItem,
  NotificationCount,
  ContactSuggestionListItem,
  ZoneSuggestionListItem,
  NotificationListItem,
} from '../types/activity.types';

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

export const viewNotifications = (notificationIds: string[]): Promise<string> =>
  http
    .post('/notification/view', null, { params: { notificationIds } })
    .then((res) => res.data);

export const readNotification = (notificationId: string): Promise<string> =>
  http.post(`/notification/read/${notificationId}`).then((res) => res.data);

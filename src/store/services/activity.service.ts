import { http } from '../../config/http';
import { PaginatedResponse } from '../../models/paginated-response';
import {
  ZoneSuggestionListItem,
  ChannelSuggestionListItem,
  NotificationListItem,
  NotificationCount,
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

export const getNotifications = (
  limit: number,
  skip: number,
  type?: 'all' | 'unread' | 'read'
): Promise<PaginatedResponse<NotificationListItem>> =>
  http
    .get('/notification/list', { params: { limit, skip, type } })
    .then((res) => res.data);

export const getNotificationCount = (): Promise<NotificationCount> =>
  http.get('/notification/count').then((res) => res.data);

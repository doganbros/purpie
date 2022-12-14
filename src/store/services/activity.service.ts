import { http } from '../../config/http';
import { PaginatedResponse } from '../../models/paginated-response';
import {
  ChannelSuggestionListItem,
  ContactSuggestionListItem,
  ZoneSuggestionListItem,
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

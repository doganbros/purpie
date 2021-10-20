import { http } from '../../config/http';
import { PaginatedResponse } from '../../models/paginated-response';
import {
  ZoneSuggestionListItem,
  ChannelSuggestionListItem,
  PostType,
  Post,
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

export const getPublicFeed = (
  limit: number,
  skip: number,
  postType?: PostType,
  streaming?: boolean
): Promise<PaginatedResponse<Post>> =>
  http
    .get('/activity/list/feed/public', {
      params: { limit, skip, postType, streaming },
    })
    .then((res) => res.data);

export const getUserFeed = (
  limit: number,
  skip: number,
  postType?: PostType,
  streaming?: boolean
): Promise<PaginatedResponse<Post>> =>
  http
    .get('/activity/list/feed/user', {
      params: { limit, skip, postType, streaming },
    })
    .then((res) => res.data);

export const getZoneFeed = (
  zoneId: number,
  limit: number,
  skip: number,
  postType?: PostType,
  streaming?: boolean
): Promise<PaginatedResponse<Post>> =>
  http
    .get(`/activity/list/feed/zone/${zoneId}`, {
      params: { limit, skip, postType, streaming },
    })
    .then((res) => res.data);

export const getChannelFeed = (
  channelId: number,
  limit: number,
  skip: number,
  postType?: PostType,
  streaming?: boolean
): Promise<PaginatedResponse<Post>> =>
  http
    .get(`/activity/list/feed/channel/${channelId}`, {
      params: { limit, skip, postType, streaming },
    })
    .then((res) => res.data);

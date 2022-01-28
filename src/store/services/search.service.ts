import { http } from '../../config/http';
import { PaginatedResponse } from '../../models/paginated-response';
import { UserBasic } from '../types/auth.types';
import { ChannelListItem } from '../types/channel.types';
import { Post } from '../types/post.types';
import {
  ChannelSearchParams,
  PostSearchParams,
  UserSearchParams,
  ZoneSearchParams,
} from '../types/search.types';
import { ZoneListItem } from '../types/zone.types';

export const searchChannel = (
  params: ChannelSearchParams
): Promise<PaginatedResponse<ChannelListItem>> =>
  http.get(`/channel/search`, { params }).then((res) => res.data);

export const searchZone = (
  params: ZoneSearchParams
): Promise<PaginatedResponse<ZoneListItem>> =>
  http.get(`/zone/search`, { params }).then((res) => res.data);

export const searchUser = (
  params: UserSearchParams
): Promise<PaginatedResponse<UserBasic>> =>
  http.get(`/user/search`, { params }).then((res) => res.data);

export const searchPost = (
  params: PostSearchParams
): Promise<PaginatedResponse<Post>> =>
  http.get(`/post/list/feed/user`, { params }).then((res) => res.data);

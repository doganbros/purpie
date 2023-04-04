import { serialize } from 'object-to-formdata';
import {
  ChannelBasic,
  ChannelListItem,
  ChannelRole,
  ChannelSearchParams,
  CreateChannelPayload,
  UserChannelPermissionList,
} from '../types/channel.types';

import { http } from '../../config/http';
import { PaginatedResponse } from '../../models/paginated-response';

export const createChannel = (
  userZoneId: number,
  channelInfo: CreateChannelPayload
): Promise<any> =>
  http
    .post(`/channel/create/${userZoneId}`, channelInfo)
    .then((res) => res.data);

export const getUserChannels = (): Promise<PaginatedResponse<any>> =>
  http.get('/user-channel/list').then((res) => res.data);

export const getUserChannelsAll = (): Promise<PaginatedResponse<any>> =>
  http.get('/user-channel/list/all').then((res) => res.data);

export const getUserChannelsByZoneId = (
  zoneId: number
): Promise<PaginatedResponse<any>> =>
  http.get(`/user-channel/list/${zoneId}`).then((res) => res.data);

export const getUserChannelById = (id: number): Promise<any> =>
  http.get(`/user-channel/detail/${id}`).then((res) => res.data);

export const joinChannel = (id: string): Promise<any> =>
  http.post(`/channel/join/${id}`).then((res) => res.data);

export const updateChannel = (
  channel: Record<string, any>,
  channelId: number
): Promise<any> =>
  http.put(`/channel/update/${channelId}`, channel).then((res) => res.data);

export const deleteUserChannel = (userChannelId: number): Promise<any> =>
  http.delete(`/user-channel/remove/${userChannelId}`).then((res) => res.data);

export const searchChannel = (
  params: ChannelSearchParams
): Promise<PaginatedResponse<ChannelListItem>> =>
  http.get(`/channel/search`, { params }).then((res) => res.data);

export const updateChannelPhoto = (
  photoFile: File,
  channelId: string
): Promise<any> =>
  http
    .put(`channel/${channelId}/display-photo`, serialize(photoFile))
    .then((res) => res.data);

export const updateChannelInfo = (
  channelId: string,
  params: ChannelBasic
): Promise<any> =>
  http.put(`channel/update/${channelId}`, params).then((res) => res.data);

export const updateChannelPermissions = (
  channelId: string,
  params: UserChannelPermissionList
): Promise<any> =>
  http
    .put(`channel/permissions/update/${channelId}`, params)
    .then((res) => res.data);

export const listChannelUsers = (
  channelId: string,
  limit?: number,
  skip?: number
): Promise<any> =>
  http
    .get(`channel/users/list/${channelId}`, { params: { limit, skip } })
    .then((res) => res.data);

export const deleteChannel = (channelId: string): Promise<any> =>
  http.delete(`channel/remove/${channelId}`).then((res) => res.data);

export const unfollowChannel = (channelId: string): Promise<any> =>
  http.delete(`user-channel/remove/${channelId}`).then((res) => res.data);

export const listChannelRoles = (channelId: string): Promise<ChannelRole[]> =>
  http.get(`channel/role/list/${channelId}`).then((res) => res.data);

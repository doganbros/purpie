import { http } from '../../config/http';
import { PaginatedResponse } from '../../models/paginated-response';
import {
  ChannelListItem,
  ChannelSearchParams,
  CreateChannelPayload,
} from '../types/channel.types';

export const createChannel = (
  userZoneId: number,
  channelInfo: CreateChannelPayload
): Promise<any> =>
  http
    .post(`/channel/create/${userZoneId}`, channelInfo)
    .then((res) => res.data);

export const getUserChannels = (): Promise<PaginatedResponse<any>> =>
  http.get('/user-channel/list').then((res) => res.data);

export const getUserChannelsByZoneId = (
  zoneId: number
): Promise<PaginatedResponse<any>> =>
  http.get(`/user-channel/list/${zoneId}`).then((res) => res.data);

export const getUserChannelById = (id: number): Promise<any> =>
  http.get(`/user-channel/detail/${id}`).then((res) => res.data);

export const joinChannel = (id: number): Promise<any> =>
  http.post(`/channel/join/${id}`).then((res) => res.data);

export const updateChannel = (
  channel: Record<string, any>,
  channelId: number
): Promise<any> =>
  http.put(`/channel/update/${channelId}`, channel).then((res) => res.data);

export const inviteToChannel = (
  channelId: number,
  email: string
): Promise<any> =>
  http.post(`/channel/invite/${channelId}`, { email }).then((res) => res.data);

export const deleteUserChannel = (userChannelId: number): Promise<any> =>
  http.delete(`/user-channel/remove/${userChannelId}`).then((res) => res.data);

export const searchChannel = (
  params: ChannelSearchParams
): Promise<PaginatedResponse<ChannelListItem>> =>
  http.get(`/channel/search`, { params }).then((res) => res.data);

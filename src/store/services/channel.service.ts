import { http } from '../../config/http';
import { PaginatedResponse } from '../../models/paginated-response';

export const createChannel = (
  userChannelId: number,
  channelInfo: Record<string, any>
): Promise<any> =>
  http
    .post(`/channel/create/${userChannelId}`, channelInfo)
    .then((res) => res.data);

export const getUserChannels = (): Promise<PaginatedResponse<any>> =>
  http.get('/user-channel/list').then((res) => res.data);

export const getUserChannelsByUserZoneId = (
  userChannelId: number
): Promise<PaginatedResponse<any>> =>
  http.get(`/user-channel/list/${userChannelId}`).then((res) => res.data);

export const getUserChannelById = (id: number): Promise<any> =>
  http.get(`/user-channel/detail/${id}`).then((res) => res.data);

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

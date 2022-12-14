import { http } from '../../config/http';
import { PaginatedResponse } from '../../models/paginated-response';
import { User, UserBasic } from '../types/auth.types';
import { ContactUser, ProfileSearchParams } from '../types/user.types';
import { InvitationListItem } from '../types/invitation.types';
import { UserZoneListItem } from '../types/zone.types';
import { UserChannelListItem } from '../types/channel.types';

export const searchUser = (
  params: ProfileSearchParams
): Promise<PaginatedResponse<UserBasic>> =>
  http.get(`/user/search`, { params }).then((res) => res.data);

export const listContacts = ({
  userName,
  ...params
}: {
  userName?: string;
  limit?: number;
  skip?: number;
}): Promise<PaginatedResponse<ContactUser>> =>
  http
    .get(`/user/contact/list/${userName || ''}`, { params })
    .then((res) => res.data);

export const getUserProfile = (userName?: string): Promise<User> =>
  http.get(`/user/profile/${userName || ''}`).then((res) => res.data);

export const removeContact = (contactId: number): Promise<string> =>
  http.delete(`/user/contact/remove/${contactId}`).then((res) => res.data);

export const listInvitations = (params: {
  limit?: number;
  skip?: number;
}): Promise<PaginatedResponse<InvitationListItem>> =>
  http.get('/user/invitations/list', { params }).then((res) => res.data);

export const listUserPublicChannels = (
  userName: string,
  params?: {
    limit?: number;
    skip?: number;
  }
): Promise<PaginatedResponse<UserChannelListItem>> =>
  http
    .get(`/user/channel/list/${userName}`, { params })
    .then((res) => res.data);

export const listUserPublicZones = (
  userName: string,
  params?: {
    limit?: number;
    skip?: number;
  }
): Promise<PaginatedResponse<UserZoneListItem>> =>
  http.get(`/user/zone/list/${userName}`, { params }).then((res) => res.data);

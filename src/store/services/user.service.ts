import { http } from '../../config/http';
import { PaginatedResponse } from '../../models/paginated-response';
import { User, UserBasic } from '../types/auth.types';
import { InvitationListItem } from '../types/activity.types';
import { ContactUser, ProfileSearchParams } from '../types/user.types';

export const searchUser = (
  params: ProfileSearchParams
): Promise<PaginatedResponse<UserBasic>> =>
  http.get(`/user/search`, { params }).then((res) => res.data);

export const listContacts = (params: {
  limit?: number;
  skip?: number;
}): Promise<PaginatedResponse<ContactUser>> =>
  http.get('/user/contact/list', { params }).then((res) => res.data);

export const getUserProfile = (userName?: string): Promise<User> =>
  http.get(`/user/profile/${userName || ''}`).then((res) => res.data);

export const removeContact = (contactId: number): Promise<string> =>
  http.delete(`/user/contact/remove/${contactId}`).then((res) => res.data);

export const listInvitations = (params: {
  limit?: number;
  skip?: number;
}): Promise<PaginatedResponse<InvitationListItem>> =>
  http.get('/user/invitations/list', { params }).then((res) => res.data);

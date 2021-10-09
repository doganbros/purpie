import { http } from '../../config/http';
import { PaginatedResponse } from '../../models/paginated-response';
import { User } from '../types/auth.types';
import {
  CreateMeetingPayload,
  UserMeetingConfig,
} from '../types/meeting.types';

export const createMeeting = (
  meeting: CreateMeetingPayload
): Promise<string | number> =>
  http.post('/meeting/create', meeting).then((res) => res.data);

export const getUserMeetingConfig = (): Promise<UserMeetingConfig> => {
  return http.get('/meeting/config/user').then((res) => res.data);
};

export const getUserSuggestionsForMeeting = (
  name: string,
  excludeIds: Array<number> = [],
  userContacts?: boolean | null,
  channelId?: number | null
): Promise<PaginatedResponse<User>> => {
  const params: Record<string, any> = { name, limit: 6 };

  if (channelId) params.channelId = channelId;
  if (userContacts) params.userContacts = 'true';
  if (excludeIds.length) params.excludeIds = excludeIds.join(',');

  return http.get('/user/search', { params }).then((res) => res.data);
};

import { http } from '../../config/http';
import { CreateMeetingPayload, Meeting } from '../types/meeting.types';

export const createMeeting = (
  meeting: CreateMeetingPayload
): Promise<string | Meeting> =>
  http.post('/meeting/create', meeting).then((res) => res.data);

export const getUserMeetingConfig = (): Promise<Record<string, any>> => {
  return http.get('/meeting/config/user').then((res) => res.data);
};

import { http } from '../../config/http';
import {
  CreateMeetingPayload,
  Meeting,
  UpdateMeetingPayload,
} from '../types/meeting.types';

export const createMeeting = (
  meeting: CreateMeetingPayload
): Promise<Meeting> => http.post('/meeting', meeting).then((res) => res.data);

export const getMultipleMeetings = (): Promise<Array<Meeting>> =>
  http.get('/meeting').then((res) => res.data);
export const getMultipleMeetingsByTenantId = (
  tenantId: number
): Promise<Array<Meeting>> =>
  http.get(`/meeting/${tenantId}`).then((res) => res.data);

export const getMeetingById = (
  tenantId: number,
  meetingId: number
): Promise<Meeting> =>
  http.get(`/meeting/${tenantId}/${meetingId}`).then((res) => res.data);

export const deleteMeetingById = (id: number): Promise<{ result: 'delete' }> =>
  http.delete(`/meeting/${id}`).then((res) => res.data);

export const updateMeetingById = (
  id: number,
  meeting: UpdateMeetingPayload
): Promise<Meeting> =>
  http.patch(`/meeting/${id}`, meeting).then((res) => res.data);

export const getMultipleMeetingsByUserId = (): Promise<Array<Meeting>> =>
  http.get(`/meeting/-1`).then((res) => res.data);

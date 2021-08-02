import { http } from '../../config/http';
import { PaginatedResponse } from '../../models/paginated-response';
import {
  CreateZonePayload,
  UpdateZonePayload,
  UserZone,
} from '../types/zone.types';

export const createZone = (zone: CreateZonePayload): Promise<any> =>
  http.post('/zone', zone).then((res) => res.data);

export const getMultipleUserZones = (): Promise<PaginatedResponse<UserZone>> =>
  http.get('/user-zone').then((res) => res.data);

export const getUserZoneById = (id: number): Promise<UserZone> =>
  http.get(`/user-zone/${id}`).then((res) => res.data);

export const updateZone = (
  zone: UpdateZonePayload,
  zoneId: number
): Promise<any> => http.patch(`/zone/${zoneId}`, zone).then((res) => res.data);

export const inviteZone = (zoneId?: number, email?: string): Promise<any> =>
  http.get(`/user/invite/${zoneId}/${email}`).then((res) => res.data);

export const deleteUserZone = (userZoneId: number): Promise<any> =>
  http.delete(`/user-zone/${userZoneId}`).then((res) => res.data);

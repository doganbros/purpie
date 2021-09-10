import { http } from '../../config/http';
import {
  CreateZonePayload,
  UpdateZonePayload,
  UserZoneDetail,
  UserZoneListItem,
} from '../types/zone.types';

export const createZone = (zone: CreateZonePayload): Promise<any> =>
  http.post('/zone/create', zone).then((res) => res.data);

export const joinZone = (id: number): Promise<any> =>
  http.post(`/zone/join/${id}`).then((res) => res.data);

export const getUserZones = (): Promise<Array<UserZoneListItem>> =>
  http.get('/user-zone/list').then((res) => res.data);

export const getUserZoneById = (id: number): Promise<UserZoneDetail> =>
  http.get(`/user-zone/detail/${id}`).then((res) => res.data);

export const updateZone = (
  zone: UpdateZonePayload,
  zoneId: number
): Promise<any> =>
  http.put(`/zone/update/${zoneId}`, zone).then((res) => res.data);

export const inviteToZone = (zoneId: number, email: string): Promise<any> =>
  http.post(`/zone/invite/${zoneId}`, { email }).then((res) => res.data);

export const deleteUserZone = (userZoneId: number): Promise<any> =>
  http.delete(`/user-zone/remove/${userZoneId}`).then((res) => res.data);

export const deleteZone = (zoneId: number): Promise<any> =>
  http.delete(`/zone/remove/${zoneId}`).then((res) => res.data);

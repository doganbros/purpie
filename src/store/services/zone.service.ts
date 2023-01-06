import { serialize } from 'object-to-formdata';
import {
  ZoneBasic,
  CreateZonePayload,
  UpdateZonePayload,
  UserZoneDetail,
  UserZoneListItem,
  ZoneListItem,
  ZoneSearchParams,
} from '../types/zone.types';
import { http } from '../../config/http';
import { PaginatedResponse } from '../../models/paginated-response';

export const createZone = (zone: CreateZonePayload): Promise<any> =>
  http.post('/zone/create', zone).then((res) => res.data);

export const joinZone = (id: string): Promise<any> =>
  http.post(`/zone/join/${id}`).then((res) => res.data);

export const getCategories = (): Promise<any> =>
  http.get('/zone/categories/list').then((res) => res.data);

export const getUserZones = (): Promise<Array<UserZoneListItem>> =>
  http.get('/user-zone/list').then((res) => res.data);

export const getUserZoneById = (id: number): Promise<UserZoneDetail> =>
  http.get(`/user-zone/detail/${id}`).then((res) => res.data);

export const updateZone = (
  zone: UpdateZonePayload,
  zoneId: number
): Promise<any> =>
  http.put(`/zone/update/${zoneId}`, zone).then((res) => res.data);

export const deleteUserZone = (userZoneId: number): Promise<any> =>
  http.delete(`/user-zone/remove/${userZoneId}`).then((res) => res.data);

export const deleteZone = (zoneId: number): Promise<any> =>
  http.delete(`/zone/remove/${zoneId}`).then((res) => res.data);

export const searchZone = (
  params: ZoneSearchParams
): Promise<PaginatedResponse<ZoneListItem>> =>
  http.get(`/zone/search`, { params }).then((res) => res.data);

export const updateZonePhoto = (
  photoFile: File,
  zoneId: string
): Promise<any> =>
  http
    .put(`zone/${zoneId}/display-photo`, serialize(photoFile))
    .then((res) => res.data);

export const updateZoneInfo = (
  zoneId: string,
  params: ZoneBasic
): Promise<any> =>
  http.put(`zone/update/${zoneId}`, params).then((res) => res.data);

import { serialize } from 'object-to-formdata';
import {
  CreateZonePayload,
  UpdateUserZoneRoleParams,
  UpdateZonePayload,
  UserZoneDetail,
  UserZoneListItem,
  ZoneBasic,
  ZoneListItem,
  ZoneRole,
  ZoneSearchParams,
  ZoneUser,
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

export const deleteZone = (zoneId: string): Promise<any> =>
  http.delete(`/zone/remove/${zoneId}`).then((res) => res.data);

export const searchZone = (
  params: ZoneSearchParams
): Promise<PaginatedResponse<ZoneListItem>> =>
  http.get(`/zone/search`, { params }).then((res) => res.data);

export const updateZonePhoto = (
  photoFile: File,
  userZoneId: string
): Promise<any> =>
  http
    .put(`zone/${userZoneId}/display-photo`, serialize(photoFile))
    .then((res) => res.data);

export const updateZoneInfo = (
  zoneId: string,
  params: ZoneBasic
): Promise<any> =>
  http.put(`zone/update/${zoneId}`, params).then((res) => res.data);

export const leaveZone = (zoneId: string): Promise<any> =>
  http.delete(`/user-zone/remove/${zoneId}`).then((res) => res.data);

export const listZoneRoles = (zoneId: string): Promise<ZoneRole[]> =>
  http.get(`/zone/role/list/${zoneId}`).then((res) => res.data);

export const updateZonePermissions = (
  zoneId: string,
  params: ZoneRole
): Promise<any> =>
  http.put(`zone/permissions/update/${zoneId}`, params).then((res) => res.data);

export const listZoneUsers = (
  zoneId: string,
  limit?: number,
  skip?: number
): Promise<PaginatedResponse<ZoneUser>> =>
  http
    .get(`zone/users/list/${zoneId}`, { params: { limit, skip } })
    .then((res) => res.data);

export const updateUserZoneRole = (
  zoneId: string,
  params: UpdateUserZoneRoleParams
): Promise<string> =>
  http.put(`zone/role/change/${zoneId}`, params).then((res) => res.data);

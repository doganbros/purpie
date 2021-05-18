import { http } from '../../config/http';
import {
  CreateTenantPayload,
  Tenant,
  UpdateTenantPayload,
} from '../types/tenant.types';

export const createTenant = (tenant: CreateTenantPayload): Promise<any> =>
  http.post('/tenant', tenant).then((res) => res.data);

export const getMultipleTenants = (): Promise<Array<Tenant>> =>
  http.get('/tenant').then((res) => res.data);

export const getTenantById = (id: number): Promise<Tenant> =>
  http.get(`/tenant/${id}&:subdomain`).then((res) => res.data);

export const getTenantBySubdomain = (subdomain: string): Promise<Tenant> =>
  http.get(`/tenant/-1&:${subdomain}`).then((res) => res.data);

export const updateTenant = (
  tenant: UpdateTenantPayload,
  tenantId: number
): Promise<any> =>
  http.patch(`/tenant/${tenantId}`, tenant).then((res) => res.data);

export const inviteTenant = (tenantId?: number, email?: string): Promise<any> =>
  http.get(`/user/invite/${tenantId}/${email}`).then((res) => res.data);

export const deleteTenant = (tenantId: number): Promise<any> =>
  http.delete(`/tenant/${tenantId}`).then((res) => res.data);

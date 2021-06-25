import { ResponseError } from '../../models/response-error';
import {
  TENANT_CREATE_SUCCESS,
  TENANT_CREATE_FAILED,
  TENANT_CREATE_REQUESTED,
  TENANT_GET_ALL_SUCCESS,
  TENANT_GET_ALL_FAILED,
  TENANT_GET_ALL_REQUESTED,
  TENANT_GET_SUCCESS,
  TENANT_GET_FAILED,
  TENANT_GET_REQUESTED,
  TENANT_UPDATE_SUCCESS,
  TENANT_UPDATE_FAILED,
  TENANT_UPDATE_REQUESTED,
  TENANT_DELETE_SUCCESS,
  TENANT_DELETE_FAILED,
  TENANT_DELETE_REQUESTED,
  OPEN_CREATE_TENANT_LAYER,
  CLOSE_CREATE_TENANT_LAYER,
  OPEN_UPDATE_TENANT_LAYER,
  OPEN_INVITE_PERSON_LAYER,
  CLOSE_INVITE_PERSON_LAYER,
  INVITE_PERSON_LAYER_REQUESTED,
  CLOSE_UPDATE_TENANT_LAYER,
} from '../constants/tenant.constants';
import { UtilActionParams } from './util.types';

export interface Tenant {
  id: number;
  name: string;
  description: string;
  website: string;
  subdomain: string;
  adminId: number;
  active: boolean;
  createdAt: Date;
}

export interface CreateTenantPayload {
  name: string;
  description: string;
  website: string;
  apiKey: string;
  secret: string;
}
export interface InviteTenantPayload {
  email: string;
}

export type UpdateTenantPayload = Partial<CreateTenantPayload>;

export interface TenantState {
  getMultipleTenants: {
    loading: boolean;
    tenants: Array<Tenant> | null;
    error: ResponseError | null;
  };
  getOneTenant: {
    loading: boolean;
    tenant: Tenant | null;
    error: ResponseError | null;
  };
  createTenant: {
    layerIsVisible: boolean;
    loading: boolean;
    error: ResponseError | null;
  };
  updateTenant: {
    layerIsVisible: boolean;
    loading: boolean;
    error: ResponseError | null;
  };
  invitePersonTenant: {
    layerInviteIsVisible: boolean;
    loading: boolean;
    error: ResponseError | null;
  };
  deleteTenant: {
    loading: boolean;
    error: ResponseError | null;
  };
}

export type TenantActionParams =
  | {
      type:
        | typeof TENANT_CREATE_SUCCESS
        | typeof TENANT_CREATE_REQUESTED
        | typeof TENANT_UPDATE_SUCCESS
        | typeof TENANT_DELETE_REQUESTED
        | typeof TENANT_GET_REQUESTED
        | typeof TENANT_GET_ALL_REQUESTED
        | typeof TENANT_UPDATE_REQUESTED
        | typeof OPEN_CREATE_TENANT_LAYER
        | typeof CLOSE_CREATE_TENANT_LAYER
        | typeof OPEN_UPDATE_TENANT_LAYER
        | typeof CLOSE_INVITE_PERSON_LAYER
        | typeof INVITE_PERSON_LAYER_REQUESTED
        | typeof OPEN_INVITE_PERSON_LAYER
        | typeof CLOSE_UPDATE_TENANT_LAYER
        | typeof TENANT_DELETE_SUCCESS;
    }
  | {
      type: typeof TENANT_GET_SUCCESS;
      payload: Tenant;
    }
  | {
      type: typeof TENANT_GET_ALL_SUCCESS;
      payload: Array<Tenant>;
    }
  | {
      type:
        | typeof TENANT_CREATE_FAILED
        | typeof TENANT_UPDATE_FAILED
        | typeof TENANT_DELETE_FAILED
        | typeof CLOSE_INVITE_PERSON_LAYER
        | typeof TENANT_GET_FAILED
        | typeof TENANT_GET_ALL_FAILED;
      payload: ResponseError;
    };

export interface TenantDispatch {
  (dispatch: TenantActionParams | UtilActionParams): void;
}

export interface TenantAction {
  (dispatch: TenantDispatch): Promise<void>;
}

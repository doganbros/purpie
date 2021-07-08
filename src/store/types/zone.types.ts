import { PaginatedResponse } from '../../models/paginated-response';
import { ResponseError } from '../../models/response-error';
import {
  USER_ZONE_CREATE_SUCCESS,
  USER_ZONE_CREATE_FAILED,
  USER_ZONE_CREATE_REQUESTED,
  USER_ZONE_GET_ALL_SUCCESS,
  USER_ZONE_GET_ALL_FAILED,
  USER_ZONE_GET_ALL_REQUESTED,
  USER_ZONE_GET_SUCCESS,
  USER_ZONE_GET_FAILED,
  USER_ZONE_GET_REQUESTED,
  USER_ZONE_UPDATE_SUCCESS,
  USER_ZONE_UPDATE_FAILED,
  USER_ZONE_UPDATE_REQUESTED,
  USER_ZONE_DELETE_SUCCESS,
  USER_ZONE_DELETE_FAILED,
  USER_ZONE_DELETE_REQUESTED,
  OPEN_CREATE_USER_ZONE_LAYER,
  CLOSE_CREATE_USER_ZONE_LAYER,
  OPEN_UPDATE_USER_ZONE_LAYER,
  OPEN_INVITE_PERSON_LAYER,
  CLOSE_INVITE_PERSON_LAYER,
  INVITE_PERSON_LAYER_REQUESTED,
  CLOSE_UPDATE_USER_ZONE_LAYER,
} from '../constants/zone.constants';
import { UtilActionParams } from './util.types';

export interface Zone {
  id: number;
  name: string;
  description: string;
  subdomain: string;
  public: boolean;
  adminId: number;
  active: boolean;
  createdAt: Date;
}

export interface UserZone {
  zone: Zone;
}

export interface CreateZonePayload {
  name: string;
  description: string;
  subdomain: string;
}
export interface InviteZonePayload {
  email: string;
}

export type UpdateZonePayload = Partial<CreateZonePayload>;

export interface ZoneState {
  getMultipleUserZones: {
    loading: boolean;
    total: number | null;
    userZones: Array<UserZone> | null;
    error: ResponseError | null;
  };
  getOneZone: {
    loading: boolean;
    userZone: UserZone | null;
    error: ResponseError | null;
  };
  createZone: {
    layerIsVisible: boolean;
    loading: boolean;
    error: ResponseError | null;
  };
  updateZone: {
    layerIsVisible: boolean;
    loading: boolean;
    error: ResponseError | null;
  };
  invitePersonZone: {
    layerInviteIsVisible: boolean;
    loading: boolean;
    error: ResponseError | null;
  };
  deleteUserZone: {
    loading: boolean;
    error: ResponseError | null;
  };
}

export type ZoneActionParams =
  | {
      type:
        | typeof USER_ZONE_CREATE_SUCCESS
        | typeof USER_ZONE_CREATE_REQUESTED
        | typeof USER_ZONE_UPDATE_SUCCESS
        | typeof USER_ZONE_DELETE_REQUESTED
        | typeof USER_ZONE_GET_REQUESTED
        | typeof USER_ZONE_GET_ALL_REQUESTED
        | typeof USER_ZONE_UPDATE_REQUESTED
        | typeof OPEN_CREATE_USER_ZONE_LAYER
        | typeof CLOSE_CREATE_USER_ZONE_LAYER
        | typeof OPEN_UPDATE_USER_ZONE_LAYER
        | typeof CLOSE_INVITE_PERSON_LAYER
        | typeof INVITE_PERSON_LAYER_REQUESTED
        | typeof OPEN_INVITE_PERSON_LAYER
        | typeof CLOSE_UPDATE_USER_ZONE_LAYER
        | typeof USER_ZONE_DELETE_SUCCESS;
    }
  | {
      type: typeof USER_ZONE_GET_SUCCESS;
      payload: UserZone;
    }
  | {
      type: typeof USER_ZONE_GET_ALL_SUCCESS;
      payload: PaginatedResponse<UserZone>;
    }
  | {
      type:
        | typeof USER_ZONE_CREATE_FAILED
        | typeof USER_ZONE_UPDATE_FAILED
        | typeof USER_ZONE_DELETE_FAILED
        | typeof CLOSE_INVITE_PERSON_LAYER
        | typeof USER_ZONE_GET_FAILED
        | typeof USER_ZONE_GET_ALL_FAILED;
      payload: ResponseError;
    };

export interface ZoneDispatch {
  (dispatch: ZoneActionParams | UtilActionParams): void;
}

export interface ZoneAction {
  (dispatch: ZoneDispatch): Promise<void>;
}

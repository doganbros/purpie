import { ResponseError } from '../../models/response-error';
import { Category } from '../../models/utils';
import {
  CREATE_ZONE_FAILED,
  CREATE_ZONE_REQUESTED,
  DELETE_USER_ZONE_FAILED,
  DELETE_USER_ZONE_REQUESTED,
  DELETE_ZONE_FAILED,
  DELETE_ZONE_REQUESTED,
  GET_CURRENT_USER_ZONE_FAILED,
  GET_CURRENT_USER_ZONE_REQUESTED,
  GET_CURRENT_USER_ZONE_SUCCESS,
  GET_USER_ZONES_FAILED,
  GET_USER_ZONES_REQUESTED,
  GET_USER_ZONES_SUCCESS,
  GET_USER_ZONE_BY_ID_FAILED,
  GET_USER_ZONE_BY_ID_REQUESTED,
  GET_USER_ZONE_BY_ID_SUCCESS,
  INVITE_TO_ZONE_FAILED,
  INVITE_TO_ZONE_REQUESTED,
  SET_CURRENT_USER_ZONE,
  UPDATE_ZONE_FAILED,
  UPDATE_ZONE_REQUESTED,
} from '../constants/zone.constants';
import { User } from './auth.types';

export interface ZoneListItem {
  id: number;
  name: string;
  subdomain: string;
  description: string;
  public: boolean;
  createdBy?: User;
  category?: Category;
}

export type ZoneRoleCode = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'NORMAL';

export interface ZoneRole {
  roleCode: ZoneRoleCode;
  roleName: string;
  canCreateChannel: boolean;
  canInvite: boolean;
  canDelete: boolean;
  canEdit: boolean;
}

export interface UserZoneListItem {
  id: number;
  createdOn: Date;
  zoneRole: ZoneRole;
  zone: ZoneListItem;
}

export interface UserZoneDetail extends UserZoneListItem {
  zone: Required<ZoneListItem>;
}

export interface CreateZonePayload {
  name: string;
  subdomain: string;
  description: string;
  public?: boolean;
  categoryId: number;
}

export type UpdateZonePayload = Partial<CreateZonePayload>;

export type ZoneDetail = Required<ZoneListItem>;

export interface ZoneState {
  selectedUserZone: UserZoneListItem | null;
  userZoneInitialized: boolean;

  getUserZones: {
    loading: boolean;
    userZones: Array<UserZoneListItem> | null;
    error: ResponseError | null;
  };

  getUserZoneDetailById: {
    loading: boolean;
    userZone: UserZoneDetail | null;
    error: ResponseError | null;
  };

  getCurrentUserZoneDetail: {
    loading: boolean;
    userZone: UserZoneDetail | null;
    error: ResponseError | null;
  };
}

export type ZoneActionParams =
  | {
      type:
        | typeof GET_USER_ZONES_REQUESTED
        | typeof GET_USER_ZONE_BY_ID_REQUESTED
        | typeof CREATE_ZONE_REQUESTED
        | typeof UPDATE_ZONE_REQUESTED
        | typeof DELETE_USER_ZONE_REQUESTED
        | typeof GET_CURRENT_USER_ZONE_REQUESTED
        | typeof INVITE_TO_ZONE_REQUESTED
        | typeof DELETE_ZONE_REQUESTED;
    }
  | {
      type:
        | typeof GET_USER_ZONES_FAILED
        | typeof GET_USER_ZONE_BY_ID_FAILED
        | typeof CREATE_ZONE_FAILED
        | typeof DELETE_USER_ZONE_FAILED
        | typeof GET_CURRENT_USER_ZONE_FAILED
        | typeof INVITE_TO_ZONE_FAILED
        | typeof DELETE_ZONE_FAILED
        | typeof UPDATE_ZONE_FAILED;
      payload: ResponseError;
    }
  | {
      type: typeof GET_USER_ZONES_SUCCESS;
      payload: Array<UserZoneListItem>;
    }
  | {
      type:
        | typeof GET_USER_ZONE_BY_ID_SUCCESS
        | typeof GET_CURRENT_USER_ZONE_SUCCESS;
      payload: UserZoneDetail;
    }
  | {
      type: typeof SET_CURRENT_USER_ZONE;
      payload: UserZoneListItem;
    };

export interface ZoneDispatch {
  (dispatch: ZoneActionParams): void;
}

export interface ZoneAction {
  (dispatch: ZoneDispatch): void | Promise<void>;
}

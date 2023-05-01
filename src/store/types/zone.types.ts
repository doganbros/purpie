import {
  CLOSE_CREATE_ZONE_LAYER,
  CREATE_ZONE_FAILED,
  CREATE_ZONE_REQUESTED,
  CREATE_ZONE_SUCCESS,
  DELETE_USER_ZONE_FAILED,
  DELETE_USER_ZONE_REQUESTED,
  DELETE_ZONE_FAILED,
  DELETE_ZONE_REQUESTED,
  DELETE_ZONE_SUCCESS,
  GET_CURRENT_USER_ZONE_FAILED,
  GET_CURRENT_USER_ZONE_REQUESTED,
  GET_CURRENT_USER_ZONE_SUCCESS,
  GET_USER_ZONE_BY_ID_FAILED,
  GET_USER_ZONE_BY_ID_REQUESTED,
  GET_USER_ZONE_BY_ID_SUCCESS,
  GET_USER_ZONES_FAILED,
  GET_USER_ZONES_REQUESTED,
  GET_USER_ZONES_SUCCESS,
  GET_ZONE_ROLES_FAILED,
  GET_ZONE_ROLES_REQUESTED,
  GET_ZONE_ROLES_SUCCESS,
  GET_ZONE_USERS_FAILED,
  GET_ZONE_USERS_REQUESTED,
  GET_ZONE_USERS_SUCCESS,
  INVITE_TO_ZONE_FAILED,
  INVITE_TO_ZONE_REQUESTED,
  JOIN_ZONE_FAILED,
  JOIN_ZONE_REQUESTED,
  JOIN_ZONE_SUCCESS,
  LEAVE_ZONE_FAILED,
  LEAVE_ZONE_SUCCESS,
  OPEN_CREATE_ZONE_LAYER,
  SEARCH_ZONE_FAILED,
  SEARCH_ZONE_REQUESTED,
  SEARCH_ZONE_SUCCESS,
  SET_CURRENT_USER_ZONE,
  UPDATE_USER_ZONE_ROLE_FAILED,
  UPDATE_USER_ZONE_ROLE_REQUESTED,
  UPDATE_USER_ZONE_ROLE_SUCCESS,
  UPDATE_ZONE_FAILED,
  UPDATE_ZONE_INFO_FAILED,
  UPDATE_ZONE_INFO_REQUESTED,
  UPDATE_ZONE_INFO_SUCCESS,
  UPDATE_ZONE_PERMISSIONS_FAILED,
  UPDATE_ZONE_PERMISSIONS_REQUESTED,
  UPDATE_ZONE_PERMISSIONS_SUCCESS,
  UPDATE_ZONE_PHOTO_FAILED,
  UPDATE_ZONE_PHOTO_REQUESTED,
  UPDATE_ZONE_PHOTO_SUCCESS,
  UPDATE_ZONE_REQUESTED,
} from '../constants/zone.constants';

import { PaginatedResponse } from '../../models/paginated-response';
import { ResponseError } from '../../models/response-error';
import { User } from './auth.types';
import { UtilActionParams } from './util.types';

export interface ZoneBasic {
  id: string;
  name: string;
  subdomain: string;
  public: boolean;
}

export interface ZoneListItem extends ZoneBasic {
  displayPhoto: string | undefined;
  description: string;
  createdBy?: User;
}

export enum ZoneRoleCode {
  OWNER = 'OWNER',
  MODERATOR = 'MODERATOR',
  USER = 'USER',
}

export interface ZoneRole {
  id?: number;
  zoneId?: string;
  roleCode?: ZoneRoleCode;
  canCreateChannel?: boolean;
  canInvite?: boolean;
  canDelete?: boolean;
  canEdit?: boolean;
  canManageRole?: boolean;
}

export interface UserZoneListItem {
  id: string | null;
  createdOn: Date | null;
  zoneRole: Partial<ZoneRole>;
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
  categoryId: string;
}

export interface UpdateZonePayload {
  name: string;
  description?: string | null;
  subdomain: string;
  id: string;
  public: boolean;
}

export interface UpdateUserZoneRoleParams {
  userId: string;
  zoneRoleCode: ZoneRoleCode;
}

export type ZoneDetail = Required<ZoneListItem>;

export interface ZoneSearchParams {
  searchTerm: string;
  limit?: number;
  skip?: number;
}

export interface ZoneUser {
  id: string;
  createdOn: Date;
  zoneRole: ZoneRole;
  user: User;
}

export interface ZoneState {
  selectedUserZone: UserZoneListItem | null;
  userZoneInitialized: boolean;
  showCreateZoneLayer: boolean;
  getUserZones: {
    loading: boolean;
    userZones: Array<UserZoneListItem> | null | undefined;
    error: ResponseError | null;
  };
  joinZone: {
    loading: boolean;
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
  search: {
    results: PaginatedResponse<ZoneListItem>;
    loading: boolean;
    error: ResponseError | null;
  };
  zoneRoles: {
    loading: boolean;
    data: ZoneRole[];
    error: ResponseError | null;
  };
  zoneUsers: PaginatedResponse<ZoneUser> & {
    loading: boolean;
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
        | typeof DELETE_ZONE_REQUESTED
        | typeof GET_ZONE_ROLES_REQUESTED
        | typeof JOIN_ZONE_SUCCESS
        | typeof OPEN_CREATE_ZONE_LAYER
        | typeof CLOSE_CREATE_ZONE_LAYER
        | typeof CREATE_ZONE_SUCCESS
        | typeof UPDATE_ZONE_PHOTO_REQUESTED
        | typeof UPDATE_ZONE_INFO_REQUESTED
        | typeof UPDATE_ZONE_INFO_SUCCESS
        | typeof UPDATE_ZONE_PERMISSIONS_REQUESTED
        | typeof GET_ZONE_USERS_REQUESTED
        | typeof UPDATE_USER_ZONE_ROLE_REQUESTED;
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
        | typeof SEARCH_ZONE_FAILED
        | typeof UPDATE_ZONE_FAILED
        | typeof JOIN_ZONE_FAILED
        | typeof UPDATE_ZONE_PHOTO_FAILED
        | typeof UPDATE_ZONE_INFO_FAILED
        | typeof UPDATE_ZONE_PERMISSIONS_FAILED
        | typeof LEAVE_ZONE_FAILED
        | typeof GET_ZONE_ROLES_FAILED
        | typeof UPDATE_USER_ZONE_ROLE_FAILED
        | typeof GET_ZONE_USERS_FAILED;
      payload: ResponseError;
    }
  | {
      type: typeof GET_USER_ZONES_SUCCESS;
      payload: Array<UserZoneListItem>;
    }
  | {
      type: typeof UPDATE_USER_ZONE_ROLE_SUCCESS;
      payload: UpdateUserZoneRoleParams;
    }
  | {
      type: typeof GET_ZONE_USERS_SUCCESS;
      payload: PaginatedResponse<ZoneUser>;
    }
  | {
      type: typeof UPDATE_ZONE_PERMISSIONS_SUCCESS;
      payload: ZoneRole;
    }
  | {
      type: typeof GET_ZONE_ROLES_SUCCESS;
      payload: ZoneRole[];
    }
  | {
      type: typeof SEARCH_ZONE_REQUESTED;
      payload: ZoneSearchParams;
    }
  | {
      type: typeof SEARCH_ZONE_SUCCESS;
      payload: PaginatedResponse<ZoneListItem>;
    }
  | {
      type: typeof JOIN_ZONE_REQUESTED;
      payload: string;
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
    }
  | {
      type: typeof UPDATE_ZONE_PHOTO_SUCCESS;
      payload: string;
      userZoneId: string;
    }
  | {
      type: typeof DELETE_ZONE_SUCCESS;
      zoneId: string;
    }
  | { type: typeof LEAVE_ZONE_SUCCESS; leaveZoneId: string };

export interface ZoneDispatch {
  (dispatch: ZoneActionParams | UtilActionParams): void;
}

export interface ZoneAction {
  (dispatch: ZoneDispatch): void | Promise<void>;
}

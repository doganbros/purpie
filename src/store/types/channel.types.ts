import {
  UPDATE_CHANNEL_INFO_REQUESTED,
  UPDATE_CHANNEL_PERMISSIONS_REQUESTED,
  CLOSE_CREATE_CHANNEL_LAYER,
  GET_USER_CHANNELS_FAILED,
  GET_USER_CHANNELS_REQUESTED,
  GET_USER_CHANNELS_SUCCESS,
  JOIN_CHANNEL_FAILED,
  JOIN_CHANNEL_REQUESTED,
  JOIN_CHANNEL_SUCCESS,
  OPEN_CREATE_CHANNEL_LAYER,
  CREATE_CHANNEL_FAILED,
  CREATE_CHANNEL_REQUESTED,
  CREATE_CHANNEL_SUCCESS,
  SET_SELECTED_CHANNEL,
  UNSET_SELECTED_CHANNEL,
  SEARCH_CHANNEL_REQUESTED,
  SEARCH_CHANNEL_SUCCESS,
  SEARCH_CHANNEL_FAILED,
  UPDATE_CHANNEL_PHOTO_REQUESTED,
  UPDATE_CHANNEL_PHOTO_SUCCESS,
  UPDATE_CHANNEL_PHOTO_FAILED,
  UPDATE_CHANNEL_PERMISSIONS_SUCCESS,
  UPDATE_CHANNEL_INFO_SUCCESS,
  UPDATE_CHANNEL_INFO_FAILED,
  UPDATE_CHANNEL_PERMISSIONS_FAILED,
  GET_CHANNEL_USERS_REQUESTED,
  GET_CHANNEL_USERS_FAILED,
  GET_CHANNEL_USERS_SUCCESS,
} from '../constants/channel.constants';
import { PaginatedResponse } from '../../models/paginated-response';
import { ResponseError } from '../../models/response-error';
import { User, UserBasic } from './auth.types';
import { UtilActionParams } from './util.types';
import { ZoneActionParams } from './zone.types';
import { ChannelSuggestionListItem } from './activity.types';

export interface ChannelBasic {
  id: number;
  name: string;
  description: string;
  public: boolean;
  zone?: {
    id: number;
    name: string;
    subdomain: string;
    public: boolean;
  };
}

export interface ChannelListItem extends ChannelBasic {
  displayPhoto: string | undefined;
  createdBy?: User;
  zoneId: number;
}

export interface UserChannelListItem {
  channelRole: any;
  id?: number | null;
  createdOn?: Date | null;
  channel: ChannelListItem;
  displayPhoto: string | null;
}

export interface UserChannelPermissionList {
  canInvite: boolean;
  canDelete: boolean;
  canEdit: boolean;
  canManageRole: boolean;
}

export interface ChannelUser {
  id: number;
  createdOn: Date;
  user: User;
}

export interface UserChannelDetail extends UserChannelListItem {
  channel: Required<ChannelListItem>;
}

export interface ChannelSearchOptions {
  zoneId?: number;
}

export interface ChannelSearchParams extends ChannelSearchOptions {
  searchTerm: string;
  limit?: number;
  skip?: number;
}

export interface ChannelState {
  selectedChannel: UserChannelListItem | null;
  showCreateChannelLayer: boolean;
  userChannels: {
    data: UserChannelListItem[];
    loading: boolean;
    error: ResponseError | null;
  };
  joinChannel: {
    loading: boolean;
    error: ResponseError | null;
  };
  search: {
    results: PaginatedResponse<ChannelListItem>;
    loading: boolean;
    error: ResponseError | null;
  };
  channelUsers: PaginatedResponse<ChannelUser> & {
    loading: boolean;
    error: ResponseError | null;
  };
}

export interface CreateChannelPayload {
  name: string;
  topic: string;
  description: string;
  public: boolean;
}

export interface UpdateChannelPayload {
  name: string;
  description: string;
  id: number;
  public: boolean;
}

export type ChannelActionParams =
  | {
      type: typeof GET_USER_CHANNELS_SUCCESS;
      payload: UserChannelListItem[];
    }
  | {
      type: typeof SEARCH_CHANNEL_REQUESTED;
      payload: ChannelSearchParams;
    }
  | {
      type: typeof SEARCH_CHANNEL_SUCCESS;
      payload: PaginatedResponse<ChannelListItem>;
    }
  | {
      type: typeof JOIN_CHANNEL_REQUESTED;
      payload: number;
    }
  | {
      type: typeof CREATE_CHANNEL_REQUESTED;
      payload: CreateChannelPayload & { zoneId: number };
    }
  | {
      type: typeof SET_SELECTED_CHANNEL;
      payload: UserChannelListItem;
    }
  | {
      type:
        | typeof JOIN_CHANNEL_SUCCESS
        | typeof GET_USER_CHANNELS_REQUESTED
        | typeof OPEN_CREATE_CHANNEL_LAYER
        | typeof CLOSE_CREATE_CHANNEL_LAYER
        | typeof CREATE_CHANNEL_SUCCESS
        | typeof UNSET_SELECTED_CHANNEL
        | typeof UPDATE_CHANNEL_PHOTO_REQUESTED
        | typeof UPDATE_CHANNEL_INFO_REQUESTED
        | typeof UPDATE_CHANNEL_PERMISSIONS_REQUESTED
        | typeof UPDATE_CHANNEL_INFO_SUCCESS
        | typeof UPDATE_CHANNEL_PERMISSIONS_SUCCESS
        | typeof GET_CHANNEL_USERS_REQUESTED;
    }
  | {
      type: typeof UPDATE_CHANNEL_PHOTO_SUCCESS;
      payload: string;
      channelId: number;
    }
  | {
      type: typeof GET_CHANNEL_USERS_SUCCESS;
      payload: PaginatedResponse<ChannelUser>;
    }
  | {
      type:
        | typeof JOIN_CHANNEL_FAILED
        | typeof GET_USER_CHANNELS_FAILED
        | typeof CREATE_CHANNEL_FAILED
        | typeof SEARCH_CHANNEL_FAILED
        | typeof UPDATE_CHANNEL_PHOTO_FAILED
        | typeof UPDATE_CHANNEL_INFO_FAILED
        | typeof UPDATE_CHANNEL_PERMISSIONS_FAILED
        | typeof GET_CHANNEL_USERS_FAILED;
      payload: ResponseError;
    };

export interface ChannelDispatch {
  (dispatch: ChannelActionParams | ZoneActionParams | UtilActionParams): void;
}

export interface ChannelAction {
  (dispatch: ChannelDispatch): void | Promise<void>;
}

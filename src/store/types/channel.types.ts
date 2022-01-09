import { ResponseError } from '../../models/response-error';
import { Category } from '../../models/utils';
import {
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
} from '../constants/channel.constants';
import { User } from './auth.types';
import { UtilActionParams } from './util.types';
import { ZoneActionParams } from './zone.types';

export interface ChannelBasic {
  id: number;
  name: string;
  topic: string;
  description: string;
  public: boolean;
}

export interface ChannelListItem extends ChannelBasic {
  createdBy?: User;
  category?: Category;
  zoneId: number;
}

export interface UserChannelListItem {
  id?: number | null;
  createdOn?: Date | null;
  channel: ChannelListItem;
}

export interface UserChannelDetail extends UserChannelListItem {
  channel: Required<ChannelListItem>;
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
}

export interface CreateChannelPayload {
  name: string;
  topic: string;
  categoryId: number;
  description: string;
  public: boolean;
}

export type ChannelActionParams =
  | {
      type: typeof GET_USER_CHANNELS_SUCCESS;
      payload: UserChannelListItem[];
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
        | typeof UNSET_SELECTED_CHANNEL;
    }
  | {
      type:
        | typeof JOIN_CHANNEL_FAILED
        | typeof GET_USER_CHANNELS_FAILED
        | typeof CREATE_CHANNEL_FAILED;
      payload: ResponseError;
    };

export interface ChannelDispatch {
  (dispatch: ChannelActionParams | ZoneActionParams | UtilActionParams): void;
}

export interface ChannelAction {
  (dispatch: ChannelDispatch): void | Promise<void>;
}
